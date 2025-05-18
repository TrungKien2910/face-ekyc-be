import { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../../../shared/config/instances/prisma.instance";
import { statisticZodSchema } from "./statistic.validation";
import { PERIOD } from "../../../shared/constants/enum";
import { Response } from "../../../shared/utils/response.util";
import { HttpStatus } from "../../../shared/constants/enum";

const getWeekNumber = (date: Date): string => {
  const tempDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = tempDate.getUTCDay() || 7;
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((+tempDate - +yearStart) / 86400000 + 1) / 7);
  return `${weekNum}`.padStart(2, "0");
};

const groupDataByPeriod = (date: Date, period: PERIOD): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const week = getWeekNumber(d);

  switch (period) {
    case PERIOD.WEEK:
      return `${year}-W${week}`;
    case PERIOD.MONTH:
      return `${year}-${month}`;
    case PERIOD.YEAR:
      return `${year}`;
    default:
      return "";
  }
};

const processCounts = <T>(
  items: T[],
  groupKeyFn: (item: T) => string,
  successConditionFn: (item: T) => boolean
) => {
  const counts: Record<string, { success: number; fail: number }> = {};

  items.forEach((item) => {
    const key = groupKeyFn(item);
    if (!counts[key]) {
      counts[key] = { success: 0, fail: 0 };
    }
    if (successConditionFn(item)) {
      counts[key].success++;
    } else {
      counts[key].fail++;
    }
  });

  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, { success, fail }]) => ({
      period,
      success,
      fail,
      total: success + fail,
    }));
};

export class StatisticService {
  async getCountVerificationHandler(req: FastifyRequest, reply: FastifyReply) {
    const parsed = statisticZodSchema.safeParse(req.query);
    if (!parsed.success) {
      throw parsed.error;
    }
    const { period, from, to } = parsed.data;

    const startDate = from ? new Date(from) : new Date("2025-01-01");
    const endDate = to ? new Date(to) : new Date();

    try {
      const logs = await prisma.verification_logs.findMany({
        where: {
          verified_at: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          result: true,
          verified_at: true,
        },
      });

      const groupKeyFn = (log: { verified_at: Date }) =>
        groupDataByPeriod(log.verified_at, period);

      const successConditionFn = (log: { result: boolean }) => log.result;

      const sortedData = processCounts(logs, groupKeyFn, successConditionFn);

      return Response.success(
        reply,
        "Fetched verification count successfully",
        sortedData,
        HttpStatus.OK
      );
    } catch (error) {
      return Response.error(
        reply,
        "Error fetching verification data",
        [],
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getCountRegisterHandler(req: FastifyRequest, reply: FastifyReply) {
    const parsed = statisticZodSchema.safeParse(req.query);
    if (!parsed.success) {
      throw parsed.error;
    }
    const { period, from, to } = parsed.data;

    const startDate = from ? new Date(from) : new Date("2025-01-01");
    const endDate = to ? new Date(to) : new Date();

    try {
      const registrations = await prisma.face_registrations.findMany({
        where: {
          registered_at: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          registered_at: true,
        },
      });

      const groupKeyFn = (registration: { registered_at: Date }) =>
        groupDataByPeriod(registration.registered_at, period);

      const successConditionFn = () => true;

      const sortedData = processCounts(
        registrations,
        groupKeyFn,
        successConditionFn
      );

      return Response.success(
        reply,
        "Fetched registration count successfully",
        sortedData,
        HttpStatus.OK
      );
    } catch (error) {
      console.error(error);
      return Response.error(
        reply,
        "Error fetching registration data",
        [],
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
