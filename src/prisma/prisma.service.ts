import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async disconnect() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app) {
    app.enableShutdownHooks(['SIGINT', 'SIGTERM', 'SIGUSR2']);
    app.use(async (req, res, next) => {
      await next();
      await this.disconnect();
    });
  }
}
