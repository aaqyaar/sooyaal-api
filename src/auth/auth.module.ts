import { Module } from '@nestjs/common';

import { UserModule, UserService } from 'src/user';
import { AuthController, AuthService } from '.';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
