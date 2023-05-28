import { Body, Controller, Get, Post, Logger, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserViewModel } from './user.view-model';
import { UploadUserRequest } from './dtos/UploadUserRequest.dto';

@ApiTags('User')
@Controller('api/users')
export class UserController {
  constructor(private userService: UserService, private logger: Logger) {}

  @Get()
  async find(): Promise<UserViewModel[]> {
    return await this.userService.find().then((users) => {
      return users.map((u) => {
        return new UserViewModel(u);
      });
    });
  }

  @Post()
  async createUser(@Body() payload: CreateUserDto): Promise<UserViewModel> {
    const doc = await this.userService.createUser(payload);
    return new UserViewModel(doc);
  }

  @Post('/:userId')
  async updateUser(
    @Body() payload: UploadUserRequest,
    @Param('userId') userId: string,
  ): Promise<UserViewModel> {
    const doc = await this.userService.updateUser(userId, {
      roles: payload.roles,
    });
    doc.id = doc._id;
    return new UserViewModel({ id: doc._id.toString(), ...doc.toObject() });
  }
}
