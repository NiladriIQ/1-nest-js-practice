import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import authConfig from './config/auth.config';
import type { ConfigType } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { HasingProvider } from './provider/hasing.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY)
    private readonly auth: ConfigType<typeof authConfig>,
    private readonly userService: UserService,
    private readonly hasingProvider: HasingProvider,
  ) { }

  isAuthenticated: boolean = false;

  async login(loginDto: LoginDto) {
    console.log(this.auth);

    // Find the user by username
    const user = await this.userService.findByUsername(loginDto.username);
    // if (!user) throw new UnauthorizedException('Invalid username or password');

    // If the user exists, compare the password
    const isPasswordCorrect = await this.hasingProvider.comparePassword(loginDto.password, user.password);
    if(!isPasswordCorrect) throw new UnauthorizedException('Incorrect password');

    // If the password is correct, LOGIN SUCCESS - generate & return access token
    // const accessToken = this.generateAccessToken({ userId: user.id, username: user.username, email: user.email });

    // Return the token
    return {
      message: 'Login successful',
      token: '1234567890',
    };
  }

  async signup(userDto: CreateUserDto) {
    console.log(this.auth);

    return await this.userService.createUser(userDto);
  }
}
