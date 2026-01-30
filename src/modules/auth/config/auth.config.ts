import { registerAs } from "@nestjs/config";

export default registerAs('auth', () => ({
  secret: process.env.JWT_SECRET,
  accessTokenExpiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN ?? '3600', 10),
  refreshTokenExpiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN ?? '86400', 10),
  signOptions: {
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  },
}));