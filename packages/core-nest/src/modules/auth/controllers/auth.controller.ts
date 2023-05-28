import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../../user/user.model';
import { UserViewModel } from '../../user/user.view-model';
import { Request } from 'express';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('Auth')
@UseGuards(AuthGuard)
@Controller('api/auth')
export class AuthController {
  @ApiResponse({
    type: UserViewModel,
  })
  @Get('me')
  me(@Req() req: Request): UserViewModel {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    return new UserViewModel(req.user as User);
  }

  @ApiResponse({
    description: 'successfully logged out',
    status: 200,
  })
  @ApiResponse({
    description: 'failed',
    status: 500,
  })
  @Get('logout')
  async logout(@Req() req: Request) {
    const error = await new Promise((resolve) => {
      req.logout(function (err) {
        if (err) {
          return resolve(err);
        }
        resolve(undefined);
      });
    });
    if (error) {
      throw new InternalServerErrorException();
    }
  }
}
