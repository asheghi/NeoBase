import {
  Controller,
  Post,
  Body,
  NotAcceptableException,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginRequest } from '../dtos/LoginReqeust.dto';
import { AuthService } from '../services/auth.service';
import { Request } from 'express';
import {
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserViewModel } from '../../user/user.view-model';

@ApiTags('Auth')
@Controller('auth')
export class AuthPasswordController {
  constructor(private authService: AuthService) {}

  @ApiNotAcceptableResponse({
    description: 'incorrect email or password',
  })
  @ApiOkResponse({
    description: 'successfull login',
    type: UserViewModel,
  })
  @Post('password/register')
  async register(@Body() body: LoginRequest, @Req() req: Request) {
    const { email, password } = body;
    const user = await this.authService.registerUser(email, password);
    //duplicate code with login!
    const error = await new Promise((resolve) => {
      req.login(user, function (err: any) {
        if (err) {
          return resolve(err);
        }
        resolve(null);
      });
    });

    if (error) {
      throw new InternalServerErrorException();
    }
    return new UserViewModel(user);
  }

  @ApiNotAcceptableResponse({
    description: 'incorrect email or password',
  })
  @ApiOkResponse({
    description: 'successfull login',
    type: UserViewModel,
  })
  @Post('password/login')
  async login(
    @Body() body: LoginRequest,
    @Req() req: Request,
  ): Promise<UserViewModel> {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new NotAcceptableException();
    const error = await new Promise((resolve) => {
      req.login(user, function (err: any) {
        if (err) {
          return resolve(err);
        }
        resolve(null);
      });
    });

    if (error) {
      throw new InternalServerErrorException();
    }
    return new UserViewModel(user);
  }
}
