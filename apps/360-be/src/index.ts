import "dotenv/config";
import Fastify from "fastify";
import app from "./app.js";

const server = Fastify({
  logger: {
    level: "info",
  },
});

await server.register(app);

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "0.0.0.0";

try {
  await server.listen({ port, host });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
