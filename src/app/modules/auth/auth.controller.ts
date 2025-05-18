import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: FastifyRequest, reply: FastifyReply) {
    return this.authService.loginHandler(req, reply);
  }

  async logout(req: FastifyRequest, reply: FastifyReply) {
    return this.authService.logoutHandler(req, reply);
  }

  async refresh(req: FastifyRequest, reply: FastifyReply) {
    return this.authService.refreshTokenHandler(req, reply);
  }
}
