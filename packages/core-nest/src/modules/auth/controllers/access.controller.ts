import { Controller, Get, Injectable } from '@nestjs/common';
import { AccessService } from '../services/access.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('api/auth/access')
export class AccessController {
  constructor(private acccessService: AccessService) {}

  @Get()
  getAllRoles() {
    return this.acccessService.getAllRoles();
  }

  @Get()
  getAllAbilities() {
    return this.acccessService.getAllAbilites();
  }

  @Get()
  async getAllRolesAndPriorities() {
    const abilites = await this.acccessService.getAllAbilites();
    const roles = await this.acccessService.getAllRoles();

    return {
      abilites,
      roles,
    };
  }
}
