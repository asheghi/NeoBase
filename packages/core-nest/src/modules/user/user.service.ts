import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUser, User } from './user.model';
import { CreateUserDto } from './dtos/createUser.dto';
import { UploadUserRequest } from './dtos/UploadUserRequest.dto';

@Injectable()
export class UserService {
  updateUser(userId: string, payload: Partial<IUser>) {
    return this.repository.updateUser(userId, payload);
  }
  @Inject()
  private repository: UserRepository;

  findByEmail(email: string) {
    return this.repository.findByEmail(email);
  }

  async find(): Promise<User[]> {
    return this.repository.getUsers();
  }

  async createUser(user: CreateUserDto): Promise<IUser> {
    return this.repository.createUser(user);
  }
}
