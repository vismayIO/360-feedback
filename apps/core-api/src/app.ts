import { join } from "node:path";
import AutoLoad, { type AutoloadPluginOptions } from "@fastify/autoload";
import type { FastifyPluginAsync, FastifyServerOptions } from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}

const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Register TypeBox type provider
  fastify.withTypeProvider<TypeBoxTypeProvider>();

  // Load plugins (prisma, auth, current-employee, swagger, sensible)
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  // Load routes with routeParams support for path-based params
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
    routeParams: true,
  });
};

export default app;
export { app, options };
