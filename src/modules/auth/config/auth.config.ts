import { registerAs, ConfigModule, ConfigType } from "@nestjs/config";

export default registerAs('auth', () => ({
    secret: process.env.JWT_SECRET,
    signOptions: {
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '3600', 10),
        audience: process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_ISSUER,
    },
}));