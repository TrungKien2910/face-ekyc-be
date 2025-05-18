import { FastifyReply } from "fastify";

export const Response = {
  success: (
    reply: FastifyReply,
    message: string,
    data: any = [],
    statusCode = 200
  ) => {
    return reply.status(statusCode).send({
      result: 1,
      message,
      data,
    });
  },

  error: (
    reply: FastifyReply,
    message: string,
    data: any = [],
    statusCode = 400
  ) => {
    return reply.status(statusCode).send({
      result: 0,
      message,
      data,
    });
  },
};
