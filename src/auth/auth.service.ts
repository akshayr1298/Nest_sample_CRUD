import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { AuthDtoLogin, AuthDtoSignUp } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
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
      return this.signToken(user.id, user.email);
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
      // delete user.password;
      return this.signToken(user.id, user.email);
    } catch (error: any) {
      throw error;
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    try {
      const payload = {
        sub: userId,
        email,
      };
      const secret: string = this.config.get('JWT_SECRET');
      const token: string = await this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: secret,
      });
      return {
        accessToken: token,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
