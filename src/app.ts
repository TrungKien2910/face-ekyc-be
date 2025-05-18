import fastify, {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyTypeProviderDefault,
} from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fastifyFormbody from "@fastify/formbody";
import appRoutes from "./app/routes/index";
import { globalErrorHandler } from "./shared/errors/GlobalErrorHandler";
import cors from "@fastify/cors";

const buildApp = (): FastifyInstance<
  Server<typeof IncomingMessage, typeof ServerResponse>,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  FastifyBaseLogger,
  FastifyTypeProviderDefault
> => {
  const app = fastify({
    logger: true,
  });

  app.register(swagger, {
    swagger: {
      info: {
        title: "Fastify API",
        description: "API documentation",
        version: "1.0.0",
      },
      tags: [
        { name: "Auth", description: "Authentication routes" },
        { name: "Normal User", description: "Normal user operations" },
        {
          name: "History",
          description: "History of verification and registration",
        },
        { name: "Statistic", description: "Statistics operations" },
      ],
      securityDefinitions: {
        BearerAuth: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
          description: "Bearer token",
        },
        RefreshToken: {
          type: "apiKey",
          name: "refresh-token",
          in: "header",
          description: "Refresh token",
        },
      },
      security: [{ BearerAuth: [] }, { RefreshToken: [] }],
    },
  });

  app.register(swaggerUi, {
    routePrefix: "/documentation",
  });

  app.register(fastifyFormbody);

  app.register(appRoutes, { prefix: "/api/v1" });

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      result: 0,
      message: `Route ${request.method}:${request.url} not found`,
      data: [],
    });
  });

  app.setErrorHandler(globalErrorHandler);
  app.register(cors, {
    origin: true,
    credentials: true,
  });
  return app;
};

export default buildApp;
