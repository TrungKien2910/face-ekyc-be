import { FastifyInstance } from "fastify";
import { HistoryController } from "./history.controller";
import { HistoryService } from "./history.service";
import {
  getHistoryVerificationSchema,
  getHistoryRegisterSchema,
  getHistoryCountSchema,
} from "./history.validation";
import { authGuard } from "../../../shared/middlewares/auth.middlewares";

import { ROLES } from "../../../shared/constants/enum";

const history = new HistoryController(new HistoryService());
export const historyRouters = async (app: FastifyInstance) => {
  app.get("/verification", {
    schema: getHistoryVerificationSchema,
    preHandler: authGuard([ROLES.FACE_VERIFY]),
    handler: history.getHistoryVerification.bind(history),
  }),
    app.get("/register", {
      schema: getHistoryRegisterSchema,
      preHandler: authGuard([ROLES.FACE_REGISTER]),
      handler: history.getHistoryRegister.bind(history),
    });
  app.get("/count", {
    schema: getHistoryCountSchema,
    preHandler: authGuard([ROLES.FACE_VERIFY, ROLES.FACE_REGISTER]),
    handler: history.getHistoryCount.bind(history),
  });
};

export default historyRouters;
