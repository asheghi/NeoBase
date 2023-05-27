import { Body, Controller, Get, Post, Inject, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { Config } from '../config';
import { User } from './user.model';
import { CreateUserDto } from './dtos/createUser.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private userService: UserService, private logger: Logger) {}

  @Inject(Config)
  private config: Config;

  @Get()
  async find(): Promise<User[]> {
    return await this.userService.find();
  }

  @Get('config')
  async getConfig() {
    return await this.userService.find();
  }

  @Post()
  async createUser(@Body() payload: CreateUserDto): Promise<User> {
    return await this.userService.createUser(payload);
  }
}
