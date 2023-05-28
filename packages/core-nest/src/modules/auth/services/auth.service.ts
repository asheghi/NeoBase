import { Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { AuthUtils } from '../auth.utils';
import { IUser, User } from 'src/modules/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private utils: AuthUtils,
    private logger: Logger,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    console.log(user);

    if (!user) {
      const randomWaitSec = Math.random() * 5;
      await new Promise((r) => setTimeout(r, randomWaitSec * 1000));
      return null;
    }
    try {
      const passwordMatched = this.utils.comparePassword(user.password, pass);
      return passwordMatched ? user : null;
    } catch (error) {
      return null;
    }
  }
  async registerUser(email: string, password: string): Promise<IUser> {
    const existing = await this.userService.findByEmail(email);
    if (existing)
      throw new NotAcceptableException(
        'duplicate email',
        'a user with this email already exists',
      );
    const hashedPassword = this.utils.hashPassword(password);
    const user = await this.userService.createUser({
      email,
      password: hashedPassword,
      roles: ['basic'],
    });
    return user;
  }
}
