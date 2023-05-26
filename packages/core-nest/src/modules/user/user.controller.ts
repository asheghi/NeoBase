import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserViewModel } from './user.view-model';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async find(): Promise<UserViewModel[]> {
    return await this.userService.find();
  }
}
