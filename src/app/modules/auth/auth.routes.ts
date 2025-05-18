import { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { loginSchema, logoutSchema, refreshSchema } from "./auth.validation";

const authController = new AuthController(new AuthService());

export const authRoutes = async (app: FastifyInstance) => {
  app.post("/login", {
    schema: loginSchema,
    handler: authController.login.bind(authController),
  });

  app.post("/logout", {
    schema: logoutSchema,
    handler: authController.logout.bind(authController),
  });

  app.post("/refresh", {
    schema: refreshSchema,
    handler: authController.refresh.bind(authController),
  });
};

export default authRoutes;
