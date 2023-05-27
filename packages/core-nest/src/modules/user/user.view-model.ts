import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.model';

export class UserViewModel {
  constructor(user: User) {
    this.name = user.name;
    this.email = user.email;
    this.id = user.id;
  }
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
