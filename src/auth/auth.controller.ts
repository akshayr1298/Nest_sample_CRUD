import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDtoLogin, AuthDtoSignUp } from 'src/auth/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    // create a instance dependancy injections
  }

  /*POST auth/signup */
  @Post('signup')
  signUp(@Body() dto: AuthDtoSignUp) {
    return this.authService.signup(dto);
  }

  /*POST auth/signin */
  @Post('signin')
  signIn(@Body() dto: AuthDtoLogin) {
    return this.authService.login(dto);
  }
}
