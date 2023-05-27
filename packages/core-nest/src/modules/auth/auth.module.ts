import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user';
import { AuthUtils } from './auth.utils';
import { AuthController } from './controllers/auth.controller';
import { AuthPasswordController } from './controllers/password-auth.controller';

@Module({
  imports: [UserModule],
  providers: [AuthService, AuthUtils],
  controllers: [AuthController, AuthPasswordController],
})
export class AuthModule {}
