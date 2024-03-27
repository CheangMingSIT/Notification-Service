import { CaslAbilityFactory } from '@app/auth';
import { Role } from '@app/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { orderBy } from 'lodash';
import { Repository } from 'typeorm';
@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role, 'postgres') private roleRepo: Repository<Role>,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) {}

    async listRoles(user: any) {
        try {
            let roles = await this.roleRepo.find({
                select: {
                    id: true,
                    role: true,
                    hasFullDataControl: true,
                    isDisabled: true,
                    organisation: {
                        id: true,
                        name: true,
                    },
                },
                relations: ['organisation'],
                where: { organisationId: user.organisationId },
            });
            roles = orderBy(
                roles,
                ['organisation.name', 'role'],
                ['asc', 'asc'],
            );
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

    async getRole(roleId: number) {
        try {
            const { role } = await this.roleRepo.findOne({
                where: { id: roleId },
            });
            return role;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(error.message);
        }
    }
}
