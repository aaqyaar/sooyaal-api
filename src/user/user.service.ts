import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // make object of the encryption class
  private auth = new AuthService(this.prisma);
  async create(createUserDto: Prisma.UserCreateInput): Promise<any> {
    const { email, password, phone } = createUserDto;
    // find by phone or email and throw exception
    const isExist = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (isExist?.email || isExist?.phone) {
      throw new BadRequestException('Email or Phone already exist');
    }

    const hashedPassword = await this.auth.hashPassword(password);

    // createUserDTO change the password to hashedPassword and return the object

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
    return { data: user, status: true, message: 'User created successfully' };
  }

  async findAll(): Promise<any> {
    const user = await this.prisma.user.findMany();
    return { data: user, status: true, message: 'Users found successfully' };
  }

  async findOne(id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user?.email) {
      throw new NotFoundException('User not found');
    }
    return { data: user, status: true, message: 'User found successfully' };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user ${updateUserDto}`;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not foud');
    }
    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return {
      data: null,
      status: true,
      message: 'User deleted successfully',
    };
  }
}
