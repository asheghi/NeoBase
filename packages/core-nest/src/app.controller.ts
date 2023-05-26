import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { Config } from './modules/config/config.type';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(Config) private config: Config,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('config')
  getConfig() {
    console.log('config:', this.config);
    return this.config;
  }
}
