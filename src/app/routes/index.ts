import { FastifyInstance } from "fastify";
import authRoutes from "../modules/auth/auth.routes";
import normalUserRoutes from "../modules/normalUser/normalUser.routes";
import historyRouters from "../modules/history/history.routes";
import statisticRoutes from "../modules/statistic/statistic.routes";

const appRoutes = async (app: FastifyInstance) => {
  app.register(authRoutes, { prefix: "/auth" });
  app.register(normalUserRoutes, { prefix: "/normalUser" });
  app.register(historyRouters, { prefix: "/history" });
  app.register(statisticRoutes, { prefix: "/statistic" });
};
export default appRoutes;
