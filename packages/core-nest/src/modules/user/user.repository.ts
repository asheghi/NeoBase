import { Model, Types } from 'mongoose';
import { User, IUser } from './user.model';

export class UserRepository {
  async updateUser(userId: string, payload: Partial<IUser>) {
    const query = { _id: new Types.ObjectId(userId) };
    await this.model.updateOne(query, payload);
    return this.model.findOne(query);
  }
  model: Model<User>;

  constructor(model: Model<any>) {
    this.model = model;
  }

  createUser(user: IUser): Promise<IUser> {
    return this.model.create(user);
  }

  getUsers() {
    return this.model.find();
  }

  findByEmail(email: string): Promise<User> {
    return this.model.findOne({ email });
  }
}
