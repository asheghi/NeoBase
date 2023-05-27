import { Model } from 'mongoose';
import { User } from './user.model';

export class UserRepository {
  model: Model<User>;

  constructor(model: Model<any>) {
    this.model = model;
  }

  createUser(user: User): Promise<User> {
    return this.model.create(user);
  }

  getUsers() {
    return this.model.find();
  }

  findByEmail(email: string): Promise<User> {
    return this.model.findOne({ email });
  }
}
