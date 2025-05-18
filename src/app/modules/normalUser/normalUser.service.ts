import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../../shared/config/instances/prisma.instance";
import { getPagination } from "../../../shared/utils/pagination.util";
import { paginationQuerySchema } from "./normalUser.validation";
import { Response } from "../../../shared/utils/response.util";
import { HttpStatus } from "../../../shared/constants/enum";

export class NormalUserService {
  async getListNormalUserHandler(req: FastifyRequest, reply: FastifyReply) {
    const parsed = paginationQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw parsed.error;
    }
    const { skip, take } = getPagination(parsed.data);

    const query = req.query as { sort?: string };
    let orderBy: any = { created_at: "desc" };

    if (query.sort) {
      const [field, direction] = query.sort.split(",");
      const validFields = ["id", "created_at", "username", "full_name"];
      const validDirections = ["ASC", "DESC"];

      if (
        validFields.includes(field) &&
        validDirections.includes(direction?.toUpperCase())
      ) {
        orderBy = { [field]: direction.toLowerCase() as "asc" | "desc" };
      } else {
        return Response.error(
          reply,
          "Invalid sort parameter",
          [
            {
              error: `Sort must be in the format `,
            },
          ],
          HttpStatus.BAD_REQUEST
        );
      }
    }

    try {
      const users = await prisma.users.findMany({
        skip,
        take,
        orderBy,
      });

      return Response.success(
        reply,
        "Fetched normal users successfully",
        users,
        HttpStatus.OK
      );
    } catch (error: any) {
      return Response.error(
        reply,
        "Failed to fetch normal users",
        [
          {
            error: error.message || "Unknown error",
          },
        ],
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getListNormalUserCountHandler(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const total = await prisma.users.count();

      return Response.success(
        reply,
        "Fetched normal users count successfully",
        [{ total }],
        HttpStatus.OK
      );
    } catch (error: any) {
      return Response.error(
        reply,
        "Failed to fetch normal users count",
        [
          {
            error: error.message || "Unknown error",
          },
        ],
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
