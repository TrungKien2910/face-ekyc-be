import { FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";
import { envConfig } from "../../../shared/config/env";
import {
  LogoutRefreshToken,
  refreshAccessToken,
} from "../../../shared/utils/auth.utils";
import { loginZodSchema } from "./auth.validation";
import { Response } from "../../../shared/utils/response.util";
import { HttpStatus } from "../../../shared/constants/enum";
export class AuthService {
  async loginHandler(req: FastifyRequest, reply: FastifyReply) {
    const parsed = loginZodSchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }

    const { username, password } = parsed.data;

    try {
      const tokenResponse = await axios.post(
        `${envConfig.authServerUrl}/realms/${envConfig.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: envConfig.clientId,
          client_secret: envConfig.clientSecret,
          grant_type: "password",
          username,
          password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return Response.success(
        reply,
        "Login successful",
        [
          {
            access_token: tokenResponse.data.access_token,
            refresh_token: tokenResponse.data.refresh_token,
          },
        ],
        HttpStatus.OK
      );
    } catch (error: any) {
      return Response.error(
        reply,
        "Login failed",
        [
          {
            error: error.response?.data?.error_description || "Unknown error",
          },
        ],
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async logoutHandler(req: FastifyRequest, reply: FastifyReply) {
    const refreshToken = req.headers["refresh-token"];

    if (!refreshToken) {
      return Response.error(
        reply,
        "Refresh token is required",
        [],
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const success = await LogoutRefreshToken(refreshToken as string);

      if (!success) {
        return Response.error(
          reply,
          "Invalid refresh token",
          [],
          HttpStatus.UNAUTHORIZED
        );
      }

      return Response.success(reply, "Logout successful", [], HttpStatus.OK);
    } catch (error) {
      return Response.error(
        reply,
        "Logout failed",
        [
          {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        ],
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async refreshTokenHandler(req: FastifyRequest, reply: FastifyReply) {
    const refreshToken = req.headers["refresh-token"];

    if (!refreshToken) {
      return Response.error(
        reply,
        "Refresh token is required",
        [],
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const newTokens = await refreshAccessToken(refreshToken as string);

      if (!newTokens) {
        return Response.error(
          reply,
          "Invalid refresh token",
          [],
          HttpStatus.UNAUTHORIZED
        );
      }

      return Response.success(
        reply,
        "New tokens issued",
        [
          {
            access_token: newTokens.access_token,
          },
        ],
        HttpStatus.OK
      );
    } catch (error) {
      return Response.error(
        reply,
        "Token refresh failed",
        [
          {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        ],
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
