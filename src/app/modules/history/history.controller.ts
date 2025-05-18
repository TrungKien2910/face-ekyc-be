import { FastifyReply, FastifyRequest } from "fastify";
import { HistoryService } from "./history.service";
export class HistoryController {
  constructor(private HistoryService: HistoryService) {}
  async getHistoryVerification(req: FastifyRequest, reply: FastifyReply) {
    return this.HistoryService.getHistoryVerificationHandler(req, reply);
  }
  async getHistoryRegister(req: FastifyRequest, reply: FastifyReply) {
    return this.HistoryService.getHistoryRegisterHandler(req, reply);
  }
  async getHistoryCount(req: FastifyRequest, reply: FastifyReply) {
    return this.HistoryService.getHistoryCountHandler(req, reply);
  }
}
