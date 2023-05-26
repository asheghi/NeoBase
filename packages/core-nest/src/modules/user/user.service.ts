import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [
    {
      name: 'bahman',
    },
    {
      name: 'peter',
    },
  ];

  async find() {
    return this.users;
  }
}
