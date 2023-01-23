import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { login } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async generateToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async login(auth: login): Promise<any> {
    const { email, password } = auth;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user?.email) {
      throw new NotFoundException('Email not exist');
    }
    if (!user?.isConfirmed) {
      throw new BadRequestException('Email not confirmed');
    }
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Password not valid');
    }
    const token = await this.generateToken(user.id);
    return { data: user, token };
  }
}
