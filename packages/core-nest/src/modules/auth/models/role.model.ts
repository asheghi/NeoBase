import { Types } from 'mongoose';

export interface IRole {
  name: string;
  abilities: Types.ObjectId[];
}
