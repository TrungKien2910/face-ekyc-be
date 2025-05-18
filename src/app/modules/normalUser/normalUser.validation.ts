import { z } from "zod";
export const paginationQuerySchema = z.object({
  page_number: z.number().min(1, "page_number must be >= 1"),
  page_size: z.number().min(1, "page_size must be >= 1"),
});

export const getNormalUserSchema = {
  tags: ["Normal User"],

  querystring: {
    type: "object",
    properties: {
      page_number: { type: "integer", description: "Page number", minimum: 1 },
      page_size: {
        type: "integer",
        description: "Number of users per page",
        minimum: 1,
      },
      sort : {type:"string"}
    },
    required: ["page_number", "page_size"],
  },

  // response: {
  //   200: {
  //     description: "Fetched normal users successfully",
  //     type: "object",
  //     properties: {
  //       result: { type: "integer", example: 1 },
  //       message: {
  //         type: "string",
  //         example: "Fetched normal users successfully",
  //       },
  //       data: {
  //         type: "array",
  //         items: {
  //           type: "object",
  //           properties: {
  //             id: { type: "string", format: "uuid" },
  //             username: { type: "string" },
  //             full_name: { type: "string" },
  //             created_at: { type: "string", format: "date-time" },
  //           },
  //         },
  //       },
  //     },
  //   },
  // },
};

export const getNormalUserCountSchema = {
  tags: ["Normal User"],

  response: {
    200: {
      description: "Fetched normal users count successfully",
      type: "object",
      properties: {
        result: { type: "integer" },
        message: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              total: { type: "integer" },
            },
          },
        },
      },
    },
  },
};
