import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    // create a instance dependancy injections
  }

  /*POST auth/signup */
  @Post('signup')
  signUp() {
    return this.authService.signup();
  }

  /*POST auth/signin */
  @Post('signin')
  signIn() {
    return this.authService.login();
  }
}
