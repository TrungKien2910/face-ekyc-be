import { StatisticService } from "./statistic.service";
import { FastifyRequest, FastifyReply } from "fastify";

export class StatisticController {
  constructor(private StatisticService: StatisticService) {}
  async getCountVerification(req: FastifyRequest, reply: FastifyReply) {
    return this.StatisticService.getCountVerificationHandler(req, reply);
  }
  async getCountRegister(req: FastifyRequest, reply: FastifyReply) {
    return this.StatisticService.getCountRegisterHandler(req, reply);
  }
}
