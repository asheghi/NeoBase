import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user';
import { AuthUtils } from './auth.utils';
import { AuthController } from './controllers/auth.controller';
import { AuthPasswordController } from './controllers/password-auth.controller';
import { AbilitysRepository } from './repository/ability.repository';
import { DatabaseService } from '../database/database.service';
import { IAbility } from './models/ability.model';
import { RolesRepository } from './repository/roles.repository';
import { IRole } from './models/role.model';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [UserModule, DatabaseModule],
  providers: [
    AuthService,
    AuthUtils,
    {
      provide: AbilitysRepository,
      useFactory: async (db: DatabaseService) => {
        const model = await db.getModel<IAbility>('ability', 'admin');
        return new AbilitysRepository(model);
      },
      inject: [DatabaseService],
    },
    {
      provide: RolesRepository,
      useFactory: async (db: DatabaseService) => {
        const model = await db.getModel<IRole>('role', 'admin');
        return new RolesRepository(model);
      },
      inject: [DatabaseService],
    },
  ],
  controllers: [AuthController, AuthPasswordController],
})
export class AuthModule {}
