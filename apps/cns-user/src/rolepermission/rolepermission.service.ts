import { Permission, Role, RolePermission } from '@app/common';
import {
    BadRequestException,
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
        @InjectRepository(Permission, 'postgres')
        private permissionRepo: Repository<Permission>,
    ) {}

    async createRoleWithPermission(role: string, permissionId: number[]) {
        try {
            let existingRole = await this.roleRepo.findOne({ where: { role } });
            if (!existingRole) {
                const newRole = this.roleRepo.create({ role });
                existingRole = await this.roleRepo.save(newRole);
            } else {
                return 'Existing role with permission already created';
            }

            permissionId.forEach(async (id) => {
                const rolePermission = this.rolePermissionRepo.create({
                    permissionId: id,
                    roleId: existingRole.id,
                });
                await this.rolePermissionRepo.save(rolePermission);
            });
            return 'Role created successfully';
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                throw new InternalServerErrorException(
                    'Error creating role with permission',
                );
            }
        }
    }

    async updateRoleWithPermission(roleId: number, permissionIds: number[]) {
        try {
            let newRolePermissions = [];
            const existingRole = await this.roleRepo.findOne({
                where: { id: roleId },
                relations: {
                    rolePermissions: true,
                },
            });
            if (!existingRole) {
                throw new BadRequestException('Role does not exist');
            }
            existingRole.rolePermissions.forEach(async (rolePermission) => {
                await this.rolePermissionRepo.delete(rolePermission);
            });
            permissionIds.forEach(async (id) => {
                const rolePermission = this.rolePermissionRepo.create({
                    permissionId: id,
                    roleId: existingRole.id,
                });
                newRolePermissions.push(rolePermission);
            });
            await this.rolePermissionRepo.save(newRolePermissions);
            return "Role's permissions updated successfully";
        } catch (error) {
            throw new InternalServerErrorException(
                'Error updating role with permission',
            );
        }
    }

    async deleteRole(roleId: number) {
        try {
            const existingRole = await this.roleRepo.findOne({
                where: { id: roleId },
                relations: {
                    rolePermissions: true,
                },
            });
            if (!existingRole) {
                throw new BadRequestException('Role does not exist');
            }
            existingRole.rolePermissions.forEach(async (rolePermission) => {
                await this.rolePermissionRepo.delete(rolePermission);
            });
            await this.roleRepo.delete(existingRole.id);
            return 'Role deleted successfully';
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                throw new InternalServerErrorException('Error deleting role');
            }
        }
    }

    async listRolePermission(roleId: number) {
        try {
            const rolePermissionsList = await this.roleRepo.find({
                where: { id: roleId },
                relations: {
                    rolePermissions: {
                        permission: true,
                    },
                },
            });
            const payload = rolePermissionsList.map((role) => {
                return {
                    role: role.role,
                    permissions: role.rolePermissions.map((rolePermission) => {
                        return {
                            id: rolePermission.permission.permissionId,
                            action: rolePermission.permission.action,
                            subject: rolePermission.permission.subject,
                            conditions: rolePermission.permission.conditions,
                        };
                    }),
                };
            });
            return payload;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error fetching role permissions',
            );
        }
    }
}
