import { Injectable } from '@nestjs/common';
import { IUserResponse } from 'src/interfaces/user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

class Encryption {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  // make object of the encryption class
  private encrypt = new Encryption();
  async create(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const { name, email, password } = createUserDto;
    const isExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isExist?.email) {
      return { message: 'User already exists', status: false, data: null };
    }
    const hashedPassword = await this.encrypt.hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return { data: user, status: true, message: 'User created successfully' };
  }

  async findAll(): Promise<IUserResponse> {
    const user = await this.prisma.user.findMany();
    if (user.length === 0) {
      return { message: 'No user found', status: false, data: null };
    }
    return { data: user, status: true, message: 'Users found successfully' };
  }

  async findOne(id: string): Promise<IUserResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return { message: 'No user found', status: false, data: null };
    }
    return { data: user, status: true, message: 'User found successfully' };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!findUser) {
      return { message: 'No user found', status: false, data: null };
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
