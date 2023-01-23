import { Module } from '@nestjs/common';

// import { AuthController, AuthService } from 'src/auth';
import { UserController, UserService } from '.';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
