import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RolesRepository } from '../repository/roles.repository';
import { AbilitysRepository } from '../repository/ability.repository';
import { IAbility } from '../models/ability.model';
import { Types } from 'mongoose';
import { User } from '../../user/user.model';

@Injectable()
export class AccessService {
  constructor(
    private rolesRepo: RolesRepository,
    private abilitiesRepo: AbilitysRepository,
    private logger: Logger,
  ) {}

  async can(user: User, action: string, subject: string, condition?: object) {
    // get user abilities
    // check if user have the same ability which requested
    return false;
  }

  async getAllRoles() {
    return this.rolesRepo.getAll();
  }

  async getAllAbilites() {
    return this.abilitiesRepo.getAll();
  }

  async createRole(name: string) {
    const existing = await this.rolesRepo.getByName(name);
    if (existing) {
      throw new BadRequestException('role ' + name + 'already exists!');
    }

    const doc = { name, abilities: [] };
    return this.rolesRepo.create(doc);
  }

  deleteRole(name: string) {
    return this.rolesRepo.deleteByName(name);
  }

  createAbility(ability: IAbility) {
    return this.abilitiesRepo.create(ability);
  }

  async addAbilityToRole(ability_id: string, role_id: string) {
    const role = await this.rolesRepo.getById(role_id);
    const abilityId = new Types.ObjectId(ability_id);
    role.abilities.push(abilityId);
    await role.save();
    return role;
  }

  async removeAbilityFromRole(ability_id: string, role_id: string) {
    const role = await this.rolesRepo.getById(role_id);
    role.abilities = role.abilities.filter(
      (a) => a._id.toString() !== ability_id,
    );
    await role.save();
    return role;
  }
}
