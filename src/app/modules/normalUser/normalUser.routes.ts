import { FastifyInstance } from "fastify/types/instance";
import { NormalUserController } from "./normalUser.controller";
import { NormalUserService } from "./normalUser.service";
import { authGuard } from "../../../shared/middlewares/auth.middlewares";
import { ROLES } from "../../../shared/constants/enum";
import {
  getNormalUserSchema,
  getNormalUserCountSchema,
} from "./normalUser.validation";

const normalUser = new NormalUserController(new NormalUserService());

export const normalUserRoutes = async (app: FastifyInstance) => {
  app.get("", {
    schema: getNormalUserSchema,
    preHandler: authGuard([ROLES.ADMIN, ROLES.SUPPORT]),
    handler: normalUser.getListNormalUser.bind(normalUser),
  });
  app.get("/count", {
    schema: getNormalUserCountSchema,
    preHandler: authGuard([ROLES.ADMIN, ROLES.SUPPORT]),
    handler: normalUser.getListNormalUserCount.bind(normalUser),
  });
};

export default normalUserRoutes;
