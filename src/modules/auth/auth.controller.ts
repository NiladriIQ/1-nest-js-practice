import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() user: {email: string, password: string}) {
    return this.authService.login(user.email, user.password);
  }

  @Post('signup')
  signup(@Body() user: CreateUserDto) {
    return this.authService.signup(user);
  }
}
