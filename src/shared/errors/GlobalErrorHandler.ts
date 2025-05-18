  import { handleZodError } from "./HandleZodError";
  import ApiError from "./ApiError";
  import { ZodError } from "zod";
  import { FastifyError, FastifyRequest, FastifyReply } from "fastify";

  export const globalErrorHandler = (
    error: FastifyError | ZodError | ApiError,
    request: FastifyRequest,
    reply: FastifyReply
  ): void => {
    if (error instanceof ZodError) {
      const zodError = handleZodError(error);
      reply.status(400).send(zodError);
      return;
    }

    if ((error as any).validation) {
      const validationErrors = (error as any).validation.map((err: any) => {
        return {
          path:
            err.instancePath?.replace(/^\//, "") ||
            err.params?.missingProperty ||
            "unknown",
          message: err.message,
        };
      });

      reply.status(400).send({
        result: 0,
        message: "Validation error",
        data: validationErrors,
      });
      return;
    }

    if (error instanceof ApiError) {
      reply.status(error.statusCode).send({
        result: 0,
        message: error.message,
        data: [],
      });
      return;
    }

    reply.status(500).send({
      result: 0,
      message: "Internal server error",
      data: [error.message],
    });
  };
