import buildApp from "./app";
import { PrismaClient } from "@prisma/client";
import { envConfig } from "./shared/config/env";
import logger from "./shared/logger";

const prisma = new PrismaClient();

const startServer = async () => {
  const app = buildApp();

  try {
    await prisma.$connect();
    logger.info("Successfully connected to the database");

    await app.listen({
      port: Number(envConfig.port) || 3000,
      host: "0.0.0.0",
    });
    logger.info(
      `Server is running on http://localhost:${envConfig.port || 3000}`
    );
    logger.info(`API documentation available at /documentation`);
    logger.info(`API routes: /api/v1/*`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();

process.on("SIGINT", async () => {
  logger.info("Shutting down server...");
  await prisma.$disconnect();
  logger.info("Database connection closed");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("Shutting down server...");
  await prisma.$disconnect();
  logger.info("Database connection closed");
  process.exit(0);
});
