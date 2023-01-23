import { Module } from '@nestjs/common';

import { UserModule } from './user';
import { AuthModule } from './auth';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    // MongooseModule.forRoot(process.env.DATABASE_URL),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
