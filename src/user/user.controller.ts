import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
 import { getUser } from 'src/auth/decorator';
import { jwtGuard } from 'src/auth/guard';

@UseGuards(jwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@getUser() user: User) {
    return { message: 'user data fetch successfully', data: user };
  }
} 
