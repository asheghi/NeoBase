import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from './user.repository';
import { DatabaseService } from '../database/database.service';
import { User } from './user.model';

@Module({
  imports: [DatabaseModule],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useFactory: async (db: DatabaseService) => {
        const model = await db.getModel<User>('user', 'admin');
        return new UserRepository(model);
      },
      inject: [DatabaseService],
    },
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
