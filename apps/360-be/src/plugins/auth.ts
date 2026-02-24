import fp from "fastify-plugin";
import { auth, type AuthUser, type Session } from "../../lib/auth";
import type { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
  interface FastifyRequest {
    session: Session | null;
    authUser: AuthUser | null;
  }
}

export default fp(
  async (fastify) => {
    fastify.decorateRequest("session", null);
    fastify.decorateRequest("authUser", null);

    // Mount Better Auth handler for all /api/auth/* routes
    fastify.all(
      "/api/auth/*",
      { schema: { tags: ["Authentication"] } },
      async (request, reply) => {
        const url = new URL(request.url, `http://${request.hostname}`);
        const headers = new Headers();
        for (const [key, value] of Object.entries(request.headers)) {
          if (value)
            headers.set(key, Array.isArray(value) ? value.join(", ") : value);
        }

        const webRequest = new Request(url.toString(), {
          method: request.method,
          headers,
          body:
            request.method !== "GET" && request.method !== "HEAD"
              ? JSON.stringify(request.body)
              : undefined,
        });

        const response = await auth.handler(webRequest);

        reply.status(response.status);
        response.headers.forEach((value, key) => {
          reply.header(key, value);
        });

        const text = await response.text();
        reply.send(text);
      },
    );

    // Authenticate - resolves session from request headers
    fastify.decorate(
      "authenticate",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const headers = new Headers();
        for (const [key, value] of Object.entries(request.headers)) {
          if (value)
            headers.set(key, Array.isArray(value) ? value.join(", ") : value);
        }

        const session = await auth.api.getSession({
          headers,
          query: { disableCookieCache: true },
        });

        if (!session) {
          return reply.code(401).send({
            statusCode: 401,
            error: "Unauthorized",
            message: "Authentication required",
          });
        }

        request.session = session.session;
        request.authUser = session.user;
      },
    );
  },
  { name: "auth", dependencies: ["prisma"] },
);
