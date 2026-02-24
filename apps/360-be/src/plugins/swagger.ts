import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export default fp(
  async (fastify) => {
    await fastify.register(swagger, {
      openapi: {
        openapi: "3.1.0",
        info: {
          title: "360 Feedback Platform API",
          description: "Multi-stakeholder anonymous feedback collection for employee performance evaluation",
          version: "1.0.0",
        },
        servers: [
          {
            url: "http://localhost:3000",
            description: "Development",
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
            cookieAuth: {
              type: "apiKey",
              in: "cookie",
              name: "better-auth.session_token",
            },
          },
        },
      },
    });

    await fastify.register(swaggerUi, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "list",
        deepLinking: true,
      },
    });
  },
  { name: "swagger" }
);
