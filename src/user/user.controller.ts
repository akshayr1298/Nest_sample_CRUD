import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
 import { getUser } from '../auth/decorator';
import { jwtGuard } from '../auth/guard';

@UseGuards(jwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@getUser() user: User) {
    return { message: 'user data fetch successfully', data: user };
  }

  @Patch()
  editUser(){
    
  }
} 
