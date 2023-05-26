import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { Config } from './modules/config/config.type';
import { ConfigService } from './modules/config/config.service';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [UserModule, ConfigModule],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: Config,
      useFactory(logger: Logger) {
        return new ConfigService(logger).getConfig();
      },
      inject: [Logger],
    },
  ],
})
export class AppModule {}
