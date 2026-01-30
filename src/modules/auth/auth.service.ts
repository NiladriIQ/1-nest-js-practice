import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import authConfig from './config/auth.config';
import type { ConfigType } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { HasingProvider } from './provider/hasing.provider';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { ActiveUserType } from './interfaces/active-user-type.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly auth: ConfigType<typeof authConfig>,
    private readonly userService: UserService,
    private readonly hasingProvider: HasingProvider,
    private readonly jwtService: JwtService,
  ) { }

  async signup(userDto: CreateUserDto) {
    return await this.userService.createUser(userDto);
  }

  async login(loginDto: LoginDto) {
    // Find the user by username
    const user = await this.userService.findByUsername(loginDto.username);

    // If the user exists, compare the password
    const isPasswordCorrect = await this.hasingProvider.comparePassword(loginDto.password, user.password);
    if (!isPasswordCorrect) throw new UnauthorizedException('Incorrect password');

    // If the password is correct, LOGIN SUCCESS - generate and return access & refresh tokens
    return await this.generateToken(user);
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync({ sub: userId, ...payload }, {
      secret: this.auth.secret,
      expiresIn,
      audience: this.auth.signOptions.audience,
      issuer: this.auth.signOptions.issuer,
    });
  }

  private async generateToken(user: User) {
    // Generate an access token
    const accessToken = await this.signToken<Partial<ActiveUserType>>(
      user.id,
      this.auth.accessTokenExpiresIn,
      { email: user.email }
    );

    // Generate a refresh token
    const refreshToken = await this.signToken<Partial<ActiveUserType>>(
      user.id,
      this.auth.refreshTokenExpiresIn,
    );

    // Return the tokens
    return { accessToken, refreshToken };
  }
}
