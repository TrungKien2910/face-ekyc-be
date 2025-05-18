import { envConfig } from "../config/env";
import axios from "axios";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: `${envConfig.authServerUrl}/realms/${envConfig.realm}/protocol/openid-connect/certs`,
});

const getKey = (header: any, callback: any) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    if (!key) {
      return callback(new Error("Signing key is undefined"));
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

export const verifyToken = async (
  token: string
): Promise<{ valid: boolean; expired: boolean }> => {
  return new Promise((resolve) => {
    jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return resolve({ valid: false, expired: true });
        }
        console.error("Invalid token:", err);
        return resolve({ valid: false, expired: false });
      }
      resolve({ valid: true, expired: false });
    });
  });
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(
      `${envConfig.authServerUrl}/realms/${envConfig.realm}/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: envConfig.clientId,
        client_secret: envConfig.clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

export const checkRole = (token: string, requiredRoles: string[]): boolean => {
  try {
    const decoded: any = jwt.decode(token);
    const roles = decoded?.realm_access?.roles || [];

    return requiredRoles.some((role) => roles.includes(role));
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

export const LogoutRefreshToken = async (refreshToken: string) => {
  try {
    await axios.post(
      `${envConfig.authServerUrl}/realms/${envConfig.realm}/protocol/openid-connect/logout`,
      new URLSearchParams({
        client_id: envConfig.clientId,
        client_secret: envConfig.clientSecret,
        refresh_token: refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
};
