import { Inject } from '@nestjs/common';
import { Config } from '../config';
import mongoose from 'mongoose';

export class DatabaseService {
  @Inject(Config)
  config: Config;

  async getModel<T>(modelName: string, databaseName: string) {
    const connection = this.getDatabaseConnection(databaseName);
    const schema = new mongoose.Schema(
      {
        __v: { type: Number, select: false },
      },
      {
        strict: false,
        validateBeforeSave: false,
        timestamps: true,
      },
    );
    return (await connection).model<T>(modelName, schema, modelName);
  }

  async getDatabaseConnection(databaseName: string) {
    const uri = this.getDatabaseUri(databaseName);
    const connection = await mongoose.createConnection(uri).asPromise();
    return connection;
  }
  getDatabaseUri(databaseName: string) {
    const temp = this.config.database.url;
    const baseUrl = temp.endsWith('/')
      ? this.config.database.url + '/'
      : this.config.database.url;
    return baseUrl + '/' + databaseName;
  }
}
