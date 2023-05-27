import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.model';
import { CreateUserDto } from './dtos/createUser.dto';

@Injectable()
export class UserService {
  findByEmail(email: string) {
    return this.repository.findByEmail(email);
  }
  @Inject()
  private repository: UserRepository;

  async find(): Promise<User[]> {
    return this.repository.getUsers();
  }

  async createUser(user: CreateUserDto): Promise<User> {
    return this.repository.createUser(User.create(user));
  }
}
