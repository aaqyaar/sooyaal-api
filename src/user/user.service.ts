import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { User, UserDocument } from 'src/schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // make object of the encryption class
  private auth = new AuthService(this.userModel);
  async create(createUserDto: CreateUserDto): Promise<any> {
    const { email, password, phone } = createUserDto;
    // find by phone or email and throw exception
    const isExist = await this.userModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (isExist?.email || isExist?.phone) {
      throw new BadRequestException('Email or Phone already exist');
    }

    const hashedPassword = await this.auth.hashPassword(password);

    // createUserDTO change the password to hashedPassword and return the object
    const data = {
      ...createUserDto,
      password: hashedPassword,
    };

    const user = await this.userModel.create(data);
    return { data: user, status: true, message: 'User created successfully' };
  }

  async findAll(): Promise<any> {
    const user = await this.userModel.find();
    return { data: user, status: true, message: 'Users found successfully' };
  }

  async findOne(id: string): Promise<any> {
    const user = await this.userModel.findById({
      id,
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
    const findUser = await this.userModel.findById({
      id,
    });
    if (!findUser) {
      throw new NotFoundException('User not foud');
    }
    await this.userModel.deleteOne({
      id,
    });

    return {
      data: null,
      status: true,
      message: 'User deleted successfully',
    };
  }
}
