import { Logger } from '@nestjs/common';
import { Config } from '../../modules/config/config.type';
import { AppFactory } from '../../app/app';

export async function bootstrap() {
  const app = await AppFactory.buildApp();

  const config: Config = app.get(Config);
  const logger = app.get(Logger);

  const { host, port, protocol } = config.server;

  await app.listen(port, host, () => {
    logger.log(`app is listening on ${protocol}://${host}:${port}`);
  });
}
