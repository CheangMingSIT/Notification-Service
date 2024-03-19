import { Role, RolePermission } from '@app/common';
import {
    BadRequestException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RolepermissionService {
    constructor(
        @InjectRepository(RolePermission, 'postgres')
        private rolePermissionRepo: Repository<RolePermission>,
        @InjectRepository(Role, 'postgres')
        private roleRepo: Repository<Role>,
    ) {}

    async createRoleWithPermission(
        organisationId: string,
        role: string,
        hasFullDataControl: boolean,
        permission: number[],
    ) {
        try {
            let existingRole = await this.roleRepo.findOne({ where: { role } });
            if (!existingRole) {
                const newRole = this.roleRepo.create({
                    role,
                    organisationId,
                    hasFullDataControl,
                });
                existingRole = await this.roleRepo.save(newRole);
            } else {
                throw new BadRequestException('Role already exists');
            }
            permission.forEach(async (permissionId) => {
                const rolePermission = this.rolePermissionRepo.create({
                    roleId: existingRole.id,
                    permissionId,
                });
                await this.rolePermissionRepo.save(rolePermission);
            });
            return {
                status: HttpStatus.ACCEPTED,
                message: 'Role created with permission',
            };
        } catch (error) {
            console.error(error);
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                throw new InternalServerErrorException(
                    'Error creating role with permission',
                );
            }
        }
    }

    async getRolePermission(roleId: number) {
        try {
            const rolePermissionsList = await this.roleRepo.findOne({
                where: { id: roleId },
                relations: {
                    rolePermissions: {
                        permission: true,
                    },
                },
            });
            if (!rolePermissionsList) {
                throw new BadRequestException('Role does not exist');
            }
            const payload = {
                id: rolePermissionsList.id,
                role: rolePermissionsList.role,
                hasFullDataControl: rolePermissionsList.hasFullDataControl,
                permissions: rolePermissionsList.rolePermissions.map(
                    (rolePermission) => rolePermission.permissionId,
                ),
            };
            return payload;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            console.error(error);
            throw new InternalServerErrorException(
                'Error fetching role permissions',
            );
        }
    }

    async updateRoleWithPermission(
        roleId: number,
        role: string,
        hasFullDataControl: boolean,
        permissionIds: number[],
    ) {
        try {
            const existingRole = await this.roleRepo.findOne({
                where: { id: roleId },
            });
            if (!existingRole) {
                throw new BadRequestException('Role does not exist');
            }
            await this.rolePermissionRepo.delete({ roleId });
            const rolePermissions = permissionIds.map((permissionId) => ({
                roleId,
                permissionId,
            }));
            await this.roleRepo.update(
                { id: roleId },
                { role, hasFullDataControl },
            );
            await this.rolePermissionRepo.save(rolePermissions);
            return "Role's permissions updated successfully";
        } catch (error) {
            console.error(error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Error updating role with permission',
            );
        }
    }
    async disableRole(roleId: number) {
        try {
            const existingRole = await this.roleRepo.findOne({
                where: { id: roleId },
            });
            if (!existingRole) {
                throw new BadRequestException('Role does not exist');
            }
            await this.roleRepo.update({ id: roleId }, { isDisabled: true });
            await this.rolePermissionRepo.delete({ roleId });
            return 'Role disabled successfully';
        } catch (error) {
            console.error(error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Error disabling role');
        }
    }

    async enableRole(roleId: number) {
        try {
            const existingRole = await this.roleRepo.findOne({
                where: { id: roleId },
            });
            if (!existingRole) {
                throw new BadRequestException('Role does not exist');
            }
            await this.roleRepo.update({ id: roleId }, { isDisabled: false });
            return 'Role enabled successfully';
        } catch (error) {
            console.error(error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Error enabling role');
        }
    }
}
