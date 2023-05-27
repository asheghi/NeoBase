import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Logger } from '@nestjs/common';
import { setupSwagger } from './swagger/setup-swagger';
import { Config } from '../modules/config/config.type';
import { setupPassport } from './passport/setupPassport';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: Config = app.get(Config);

  setupPassport(app);
  setupSwagger(app);

  await app.listen(config.server.port, config.server.host, () => {
    const logger = app.get(Logger);
    const { protocol, host, port } = config.server;
    logger.log(`app is listening on ${protocol}://${host}:${port}`);
  });
}
