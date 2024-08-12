import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDtoLogin, AuthDtoSignUp } from './dto';

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
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() dto: AuthDtoLogin) {
    return this.authService.login(dto);
  }
}
