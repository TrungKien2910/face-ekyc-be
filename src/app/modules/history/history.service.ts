import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../../shared/config/instances/prisma.instance";
import { getPagination } from "../../../shared/utils/pagination.util";
import { paginationQuerySchema } from "./history.validation";
import { Response } from "../../../shared/utils/response.util";
import { HttpStatus } from "../../../shared/constants/enum";
export class HistoryService {
  async getHistoryVerificationHandler(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    const parsed = paginationQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw parsed.error;
    }

    const { skip, take } = getPagination(parsed.data);

    const query = req.query as { sort?: string };
    let orderBy: any = { verified_at: "desc" };

    if (query.sort) {
      const [field, direction] = query.sort.split(",");
      const validFields = [
        "id",
        "verified_at",
        "user_id",
        "face_id",
        "result",
        "confidence",
        "mask_detected",
        "is_spoofing",
        "username",
      ];
      const validDirections = ["ASC", "DESC"];

      if (
        validFields.includes(field) &&
        validDirections.includes(direction?.toUpperCase())
      ) {
        const sortDirection = direction.toLowerCase() as "asc" | "desc";
        if (field === "username") {
          orderBy = {
            user: {
              username: sortDirection,
            },
          };
        } else {
          orderBy = { [field]: sortDirection };
        }
      } else {
        return Response.error(
          reply,
          "Invalid sort parameter",
          [{ error: "Sort must be in the format field,ASC|DESC" }],
          HttpStatus.BAD_REQUEST
        );
      }
    }

    try {
      const historyVerification = await prisma.verification_logs.findMany({
        skip,
        take,
        orderBy,
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });

      const transformedHistory = historyVerification.map((record) => ({
        id: record.id,
        user_id: record.user_id,
        face_id: record.face_id,
        mask_detected: record.mask_detected,
        result: record.result,
        confidence: record.confidence,
        verified_at: record.verified_at,
        is_spoofing: record.is_spoofing,
        meta_data: record.meta_data,

        username: record.user?.username || null,
      }));
      Response.success(
        reply,
        "Fetched history verification successfully",
        transformedHistory,
        HttpStatus.OK
      );
    } catch (error: any) {
      Response.error(
        reply,
        "Failed to fetch history verification",
        [
          {
            error: error.message || "Unknown error",
          },
        ],
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getHistoryRegisterHandler(req: FastifyRequest, reply: FastifyReply) {
    const parsed = paginationQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw parsed.error;
    }

    const { skip, take } = getPagination(parsed.data);

    const query = req.query as { sort?: string };
    let orderBy: any = { registered_at: "desc" };

    if (query.sort) {
      const [field, direction] = query.sort.split(",");
      const validFields = [
        "id",
        "registered_at",
        "user_id",
        "face_id_without_mask",
        "face_id_with_mask",
        "status",
        "username",
      ];
      const validDirections = ["ASC", "DESC"];

      if (
        validFields.includes(field) &&
        validDirections.includes(direction?.toUpperCase())
      ) {
        const sortDirection = direction.toLowerCase() as "asc" | "desc";
        if (field === "username") {
          orderBy = {
            user: {
              username: sortDirection,
            },
          };
        } else {
          orderBy = { [field]: sortDirection };
        }
      } else {
        return Response.error(
          reply,
          "Invalid sort parameter",
          [{ error: "Sort must be in the format field,ASC|DESC" }],
          HttpStatus.BAD_REQUEST
        );
      }
    }
    try {
      const historyRegister = await prisma.face_registrations.findMany({
        skip,
        take,
        orderBy,
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });
 
      const transformedHistoryRegister = historyRegister.map((record) => ({
        id: record.id,
        user_id: record.user_id,
        face_id_without_mask: record.face_id_without_mask,
        face_id_with_mask: record.face_id_with_mask,
        status: record.status,
        registered_at: record.registered_at,
        username: record.user?.username || null,
      }));
      Response.success(
        reply,
        "Fetched history register successfully",
        transformedHistoryRegister,
        HttpStatus.OK
      );
    } catch (error: any) {
      Response.error(
        reply,
        "Failed to fetch history register",
        [
          {
            error: error.message || "Unknown error",
          },
        ],
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getHistoryCountHandler(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as { type: "verification" | "register" };

    try {
      // Fetch count based on type
      let total: number;
      switch (query.type) {
        case "verification":
          total = await prisma.verification_logs.count();
          break;
        case "register":
          total = await prisma.face_registrations.count();
          break;
        default:
          return Response.error(
            reply,
            "Invalid type",
            { error: "Unknown type" },
            HttpStatus.BAD_REQUEST
          );
      }

      const responseData = [{ total }];

      return Response.success(
        reply,
        `Fetched ${query.type} count successfully`,
        responseData,
        HttpStatus.OK
      );
    } catch (error: any) {
      return Response.error(
        reply,
        "Failed to fetch history count",
        [{ error: error.message || "Unknown error" }],
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
