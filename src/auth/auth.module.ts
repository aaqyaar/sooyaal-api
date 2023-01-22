import { Module } from '@nestjs/common';
import { UserModule } from 'src/user';

import { AuthController, AuthService } from '.';

@Module({
  //   imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
