import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { Config } from './config.type';

@Global()
@Module({
  providers: [
    ConfigService,
    {
      provide: Config,
      useFactory(logger: Logger) {
        return new ConfigService(logger).getConfig();
      },
      inject: [Logger],
    },
  ],
  exports: [Config],
})
export class ConfigModule {}
