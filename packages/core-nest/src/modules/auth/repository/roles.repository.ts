import { Model, ObjectId } from 'mongoose';
import { IRole } from '../models/role.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesRepository {
  private model: Model<IRole>;

  constructor(model) {
    this.model = model;
  }

  create(role: IRole) {
    return this.model.create(role);
  }

  getAll() {
    return this.model.find();
  }

  getById(id: string | ObjectId) {
    return this.model.findById(id);
  }

  getByName(name: string) {
    return this.model.findOne({ name });
  }

  async deleteByName(name: string) {
    const result = await this.model.deleteOne({ name });
    return !!result.deletedCount;
  }

  async deleteById(id: ObjectId | string) {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
