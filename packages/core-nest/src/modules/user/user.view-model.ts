import { ApiProperty } from '@nestjs/swagger';

export class UserViewModel {
  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.roles = user.roles;
    this.name = user.name;
  }
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  roles: string;
}
