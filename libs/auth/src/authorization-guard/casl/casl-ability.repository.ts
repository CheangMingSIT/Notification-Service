import { RolePermission } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { replace } from 'object-replace-mustache';
import { Repository } from 'typeorm';
@Injectable()
export class CaslAbilityRepository {
    constructor(
        @InjectRepository(RolePermission, 'postgres')
        private rolePermission: Repository<RolePermission>,
    ) {}

    async identifyAbility(roleId: any, userId: any) {
        const rolePermissions = await this.rolePermission
            .createQueryBuilder('rolePermission')
            .innerJoinAndSelect('rolePermission.permission', 'permission')
            .where('rolePermission.roleId = :roleId', { roleId: roleId })
            .getMany();
        rolePermissions.forEach((rolePermission) => {
            if (!rolePermission.permission.condition) return;
            const template = JSON.stringify(
                rolePermission.permission.condition,
            );
            if (!template.includes('{{ userId }}')) return;
            template.includes('{{ userId }}') &&
                (rolePermission.permission.condition = replace(
                    JSON.parse(template),
                    { userId },
                ));
        });

        return rolePermissions;
    }
}
