import fp from "fastify-plugin";
import { prisma } from "../../lib/prisma.js";
import type { PrismaClient } from "../../prisma/db-client/client.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(
  async (fastify) => {
    fastify.decorate("prisma", prisma);

    fastify.addHook("onClose", async () => {
      await prisma.$disconnect();
    });
  },
  { name: "prisma" }
);
