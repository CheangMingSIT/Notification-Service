import { RolePermission } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class CaslAbilityRepository {
    constructor(
        @InjectRepository(RolePermission, 'postgres')
        private rolePermission: Repository<RolePermission>,
    ) {}

    async identifyAbility(roleId: any) {
        const rolePermissions = await this.rolePermission
            .createQueryBuilder('rolePermission')
            .innerJoinAndSelect('rolePermission.permission', 'permission')
            .where('rolePermission.roleId = :roleId', { roleId: roleId })
            .getMany();
        return rolePermissions;
    }
}
