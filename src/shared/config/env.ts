import dotenv from "dotenv";
dotenv.config();
export const envConfig = {
  clientId: process.env.KEYCLOAK_CLIENT_ID || "",
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
  realm: process.env.KEYCLOAK_REALM || "",
  authServerUrl: process.env.KEYCLOAK_URL || "",
  port: process.env.PORT || 0,
};
