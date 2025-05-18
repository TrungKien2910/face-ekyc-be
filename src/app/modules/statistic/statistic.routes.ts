import { FastifyInstance } from "fastify";
import { StatisticController } from "./statistic.controller";
import { StatisticService } from "./statistic.service";
import { authGuard } from "../../../shared/middlewares/auth.middlewares";
import { ROLES } from "../../../shared/constants/enum";
import {
  statisticVerificationSchema,
  statisticRegisterSchema,
} from "./statistic.validation";
const statistic = new StatisticController(new StatisticService());
export const statisticRoutes = async (app: FastifyInstance) => {
  app.get("/countVerification", {
    schema: statisticVerificationSchema,
    preHandler: authGuard([ROLES.ADMIN, ROLES.SUPPORT]),
    handler: statistic.getCountVerification.bind(statistic),
  });
  app.get("/countRegister", {
    schema: statisticRegisterSchema,
    preHandler: authGuard([ROLES.ADMIN, ROLES.SUPPORT]),
    handler: statistic.getCountRegister.bind(statistic),
  });
};
export default statisticRoutes;
