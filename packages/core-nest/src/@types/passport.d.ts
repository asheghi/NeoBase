import 'express';
import { Request, Response, NextFunction } from 'express';
import { PassportStatic } from 'passport';
import { User as NewUser } from '../modules/user/user.model';

declare global {
  namespace Express {
    interface Request {
      user: NewUser | undefined;
      login(user: NewUser, options: any, callback: (err: any) => void): void;
    }
  }
}
