import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

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
    app.use(async (req: Request, res: Response, next: NextFunction) => {
      await next();
      await this.disconnect();
    });
  }
}
