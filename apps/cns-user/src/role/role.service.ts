import { CaslAbilityFactory, Operation } from '@app/auth';
import { Role } from '@app/common';
import { rulesToAST } from '@casl/ability/extra';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role, 'postgres') private roleRepo: Repository<Role>,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) {}

    async listRoles(user: any) {
        try {
            const ability =
                await this.caslAbilityFactory.defineAbilitiesFor(user);
            const checkPolices = rulesToAST(ability, Operation.Read, 'Role');
            if (checkPolices['field'] === 'user.organisationId') {
                const roles = await this.roleRepo.find({
                    where: { organisationId: checkPolices['value'].toString() },
                });
                return roles;
            }
            const roles = await this.roleRepo.find();
            return roles;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async roleListbasedOnOrganisationId(organisationId: string) {
        try {
            const roles = await this.roleRepo.find({
                where: { organisationId },
            });
            return roles;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(error.message);
        }
    }
}
