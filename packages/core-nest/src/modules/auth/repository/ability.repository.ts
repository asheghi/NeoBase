import { Model, ObjectId } from 'mongoose';
import { IAbility } from '../models/ability.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AbilitysRepository {
  private model: Model<IAbility>;

  constructor(model) {
    this.model = model;
  }

  getAll() {
    return this.model.find();
  }

  create(Ability: IAbility) {
    return this.model.create(Ability);
  }

  findById(id: string | ObjectId) {
    return this.model.findById(id);
  }

  findByName(name: string) {
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
