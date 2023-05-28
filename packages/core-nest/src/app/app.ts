import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { setupSwagger } from './swagger/setup-swagger';
import { setupPassport } from './passport/setupPassport';
import { INestApplication } from '@nestjs/common';

export class AppFactory {
  static async buildApp(setupMiddlewares = true): Promise<INestApplication> {
    const app = await NestFactory.create(AppModule);

    if (setupMiddlewares) {
      setupPassport(app);
      setupSwagger(app);
    }

    return app;
  }
}
