import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { UserViewModel } from './user.view-model';
import { Config } from '../config';

@Controller('users')
export class UserController {
  constructor(private userService: UserService, private logger: Logger) {}

  @Inject(Config)
  private config: Config;

  @Get()
  async find(): Promise<UserViewModel[]> {
    return await this.userService.find();
  }

  @Get('config')
  async getConfig() {
    this.logger.log(this.config);
    return await this.userService.find();
  }
}
