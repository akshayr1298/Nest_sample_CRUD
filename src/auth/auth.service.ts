import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup() {
    return { msg: 'Register successfully' };
  }
  login() {
    return { msg: 'Login successfully' };
  }
}
