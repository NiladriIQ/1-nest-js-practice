import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import authConfig from "../config/auth.config";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/allow-anonymous.decorator";
import { REQUEST_USER_KEY } from "src/constants/constants";
import { Request } from "express";

@Injectable()
export class AuthorizeGuard implements CanActivate {
    constructor(
        @Inject(authConfig.KEY) 
        private readonly auth: ConfigType<typeof authConfig>,
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // 0. Check if the route is public
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        // 1. Extract Request Obj from the Execution Context
        const request: Request = context.switchToHttp().getRequest();

        // 2. Extract the token from the authorization header
        const token = request.headers.authorization?.split(' ')[1];
        
        // If the token is not present, return false
        if (!token) throw new UnauthorizedException();

        // 3. Validate the token and Provide or Deny Access
        try {
        const payload = await this.jwtService.verifyAsync(token, { secret: this.auth.secret });
            request[REQUEST_USER_KEY] = payload;

            return true;
            
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}