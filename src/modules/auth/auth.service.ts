import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import authConfig from './config/auth.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(authConfig.KEY)
    private readonly auth: ConfigType<typeof authConfig>,
  ) { }

  isAuthenticated: boolean = false;

  login(email: string, password: string) {
    console.log(this.auth);
    
    return 'User does not exist!';
  }
}
