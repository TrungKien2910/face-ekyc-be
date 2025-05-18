import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken, checkRole } from "../utils/auth.utils";
import { HttpStatus } from "../../shared/constants/enum";
import { Response } from "../utils/response.util";
export const checkToken = async (req: FastifyRequest, reply: FastifyReply) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    Response.error(reply, "Token is required", [], HttpStatus.UNAUTHORIZED);
    return;
  }

  try {
    const { valid, expired } = await verifyToken(token);
    if (!valid) {
      if (expired) {
        Response.error(reply, "Token expired", [], HttpStatus.UNAUTHORIZED);
      } else {
        Response.error(reply, "Invalid token", [], HttpStatus.UNAUTHORIZED);
      }
      return;
    }

    (req as any).token = token;
    return;
  } catch (error) {
    Response.error(
      reply,
      "Error verifying token",
      [error],
      HttpStatus.INTERNAL_SERVER_ERROR
    );
    return;
  }
};

export const checkRoleMiddleware = (requiredRole: string[]) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return Response.error(
        reply,
        "Token is required",
        [],
        HttpStatus.UNAUTHORIZED
      );
    }

    const hasRole = checkRole(token, requiredRole);

    if (!hasRole) {
      return Response.error(
        reply,
        "Forbidden: Insufficient permissions",
        [],
        HttpStatus.FORBIDDEN
      );
    }
    return;
  };
};

export const authGuard = (requiredRoles: string[]) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return Response.error(
        reply,
        "Token is required",
        [],
        HttpStatus.UNAUTHORIZED
      );
    }

    try {
      const { valid, expired } = await verifyToken(token);
      if (!valid) {
        if (expired) {
          return Response.error(
            reply,
            "Token expired",
            [],
            HttpStatus.UNAUTHORIZED
          );
        } else {
          return Response.error(
            reply,
            "Invalid token",
            [],
            HttpStatus.UNAUTHORIZED
          );
        }
      }

      const hasRequiredRole = checkRole(token, requiredRoles);

      if (!hasRequiredRole) {
        return Response.error(
          reply,
          "Forbidden: Insufficient permissions",
          [],
          HttpStatus.FORBIDDEN
        );
      }

      return;
    } catch (error) {
      return Response.error(
        reply,
        "Error verifying token",
        [error],
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  };
};
