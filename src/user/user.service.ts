import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { IUserResponse } from 'src/interfaces/user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  // make object of the encryption class
  private auth = new AuthService(this.prisma);
  async create(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const { name, email, password } = createUserDto;
    const isExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isExist?.email) {
      throw new BadRequestException('Email already exist');
    }
    const hashedPassword = await this.auth.hashPassword(password);
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
    return { data: user, status: true, message: 'Users found successfully' };
  }

  async findOne(id: string): Promise<IUserResponse> {
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
    const findUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!findUser) {
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
