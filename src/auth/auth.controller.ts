import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from 'src/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    // create a instance dependancy injections
  }

  /*POST auth/signup */
  @Post('signup')
  signUp(@Body('email') email: string, @Body('password') password: string) {
    console.log(email, password);

    return this.authService.signup();
  }

  /*POST auth/signin */
  @Post('signin')
  signIn() {
    return this.authService.login();
  }
}
