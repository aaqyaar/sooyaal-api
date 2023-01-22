import { Injectable } from '@nestjs/common';
import { IUserResponse } from 'src/interfaces/user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const { name, email, password } = createUserDto;
    const isExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isExist.email) {
      return { message: 'User already exists', status: false, data: null };
    }
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
