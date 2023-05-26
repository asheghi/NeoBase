import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, UserModule } from './modules';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [LoggerModule, UserModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
