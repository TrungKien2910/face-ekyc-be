import { z } from "zod";
export const paginationQuerySchema = z.object({
  page_number: z.number().min(1, "page_number must be >= 1"),
  page_size: z.number().min(1, "page_size must be >= 1"),
});

export const getHistoryVerificationSchema = {
  tags: ["History"],
  querystring: {
    type: "object",
    properties: {
      page_number: { type: "integer", description: "Page number", minimum: 1 },
      page_size: { type: "integer", description: "Page size", minimum: 1 },
      sort: { type: "string" },
    },
    required: ["page_number", "page_size"],
  },
};
export const getHistoryRegisterSchema = {
  tags: ["History"],
  querystring: {
    type: "object",
    properties: {
      page_number: { type: "integer", description: "Page number", minimum: 1 },
      page_size: { type: "integer", description: "Page size", minimum: 1 },
      sort: { type: "string" },
    },
    required: ["page_number", "page_size"],
  },
};

export const getHistoryCountSchema = {
  tags: ["History"],
  querystring: {
    type: "object",
    properties: {
      type: { type: "string", enum: ["verification", "register"] },
    },
    required: ["type"],
  },
};
