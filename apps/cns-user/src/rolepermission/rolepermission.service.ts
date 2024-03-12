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
        role: string,
        hasFullDataControl: boolean,
        permission: number[],
    ) {
        try {
            let existingRole = await this.roleRepo.findOne({ where: { role } });
            if (!existingRole) {
                const newRole = this.roleRepo.create({
                    role,
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

    async listRolePermission(roleId: number) {
        try {
            const rolePermissionsList = await this.roleRepo.findOne({
                where: { id: roleId },
                relations: {
                    rolePermissions: {
                        permission: true,
                    },
                },
            });
            const payload = {
                role: rolePermissionsList.role,
                permissions: rolePermissionsList.rolePermissions.map(
                    (rolePermission) => {
                        return {
                            permissionId: rolePermission.permissionId,
                            operation: rolePermission.permission.operation,
                            resource: rolePermission.permission.resource,
                        };
                    },
                ),
            };
            return payload;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error fetching role permissions',
            );
        }
    }

    // async updateRoleWithPermission(roleId: number, permissionIds: number[]) {
    //     try {
    //         let newRolePermissions = [];
    //         const existingRole = await this.roleRepo.findOne({
    //             where: { id: roleId },
    //             relations: {
    //                 rolePermissions: true,
    //             },
    //         });
    //         if (!existingRole) {
    //             throw new BadRequestException('Role does not exist');
    //         }
    //         existingRole.rolePermissions.forEach(async (rolePermission) => {
    //             await this.rolePermissionRepo.delete(rolePermission);
    //         });
    //         permissionIds.forEach(async (id) => {
    //             const rolePermission = this.rolePermissionRepo.create({
    //                 permissionId: id,
    //                 roleId: existingRole.id,
    //             });
    //             newRolePermissions.push(rolePermission);
    //         });
    //         await this.rolePermissionRepo.save(newRolePermissions);
    //         return "Role's permissions updated successfully";
    //     } catch (error) {
    //         throw new InternalServerErrorException(
    //             'Error updating role with permission',
    //         );
    //     }
    // }
}
