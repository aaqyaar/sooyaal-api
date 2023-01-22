import { Module } from '@nestjs/common';

import { UserModule } from './user';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL),

    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
