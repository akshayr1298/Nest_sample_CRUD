import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthDtoLogin, AuthDtoSignUp } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDtoSignUp) {
    const { firstName, lastName, email, password } = dto;
    try {
      /*user already registered or not */

      // const existingUser = await this.prisma.user.findUnique({
      //   where: { email },
      // });

      // if (existingUser) {
      //   throw new ConflictException('User with this email already registered');
      // }

      /*creare new user */
      const hashPassword: string = await argon.hash(password);
      console.log(hashPassword);

      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashPassword,
          firstName,
          lastName,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
        },
      });
      return user;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'This email is already registered try another email',
          );
        }
      }
      throw error;
    }
  }

  async login(dto: AuthDtoLogin) {
    const { email, password } = dto;
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          password: true,
          createdAt: true,
        },
      });
      if (!user) {
        throw new BadRequestException('Invalid email');
      }
      const checkPassword = await argon.verify(user.password, password);
      if (!checkPassword) {
        throw new BadRequestException('Invalid Password');
      }
      delete user.password;
      return user;
    } catch (error: any) {
      throw error;
    }
    return { message: `successfully login` };
  }
}
