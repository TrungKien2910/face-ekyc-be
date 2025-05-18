import { z } from "zod";
import { PERIOD } from "../../..//shared/constants/enum";

export const statisticZodSchema = z.object({
  period: z.enum([PERIOD.WEEK, PERIOD.MONTH, PERIOD.YEAR]),
  from: z.string().date("from must be in YYYY-MM-DD format"),
  to: z.string().date("to must be in YYYY-MM-DD format"),
});

export const statisticVerificationSchema = {
  tags: ["Statistic"],
  querystring: {
    type: "object",
    properties: {
      period: {
        type: "string",
        enum: [PERIOD.WEEK, PERIOD.MONTH, PERIOD.YEAR],
        description: "Khoảng thời gian để nhóm (tuần, tháng, hoặc năm)",
      },
      from: {
        type: "string",
        format: "date",
        description: "Ngày bắt đầu (YYYY-MM-DD)",
      },
      to: {
        type: "string",
        format: "date",
        description: "Ngày kết thúc (YYYY-MM-DD)",
      },
    },
    required: ["period", "from", "to"],
  },
};
export const statisticRegisterSchema = {
  tags: ["Statistic"],
  querystring: {
    type: "object",
    properties: {
      period: {
        type: "string",
        enum: [PERIOD.WEEK, PERIOD.MONTH, PERIOD.YEAR],
        description: "Khoảng thời gian để nhóm (tuần, tháng, hoặc năm)",
      },
      from: {
        type: "string",
        format: "date",
        description: "Ngày bắt đầu (YYYY-MM-DD)",
      },
      to: {
        type: "string",
        format: "date",
        description: "Ngày kết thúc (YYYY-MM-DD)",
      },
    },
    required: ["period", "from", "to"],
  },
};
