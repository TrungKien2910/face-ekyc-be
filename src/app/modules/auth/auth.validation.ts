import { z } from "zod";

export const loginZodSchema = z.object({
  username: z.string().nonempty("Username is required"),
  password: z.string().nonempty("Password is required"),
});

export const loginSchema = {
  tags: ["Auth"],
  body: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: { type: "string", minLength: 3 },
      password: { type: "string", minLength: 3 },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        result: { type: "number" },
        message: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              access_token: { type: "string" },
              refresh_token: { type: "string" },
            },
          },
        },
      },
    },
  },
};

export const logoutSchema = {
  tags: ["Auth"],
};

export const refreshSchema = {
  tags: ["Auth"],
};
