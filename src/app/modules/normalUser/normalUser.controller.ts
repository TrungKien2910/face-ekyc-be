import { FastifyReply, FastifyRequest } from "fastify";
import { NormalUserService } from "./normalUser.service";

export class NormalUserController {
  constructor(private NormalUserService: NormalUserService) {}
  async getListNormalUser(req: FastifyRequest, reply: FastifyReply) {
    return this.NormalUserService.getListNormalUserHandler(req, reply);
  }
  async getListNormalUserCount(req: FastifyRequest, reply: FastifyReply) {
    return this.NormalUserService.getListNormalUserCountHandler(req, reply);
  }
}
