import { RolePermission } from '@app/common';
import {
    HttpException,
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
    ) {}

    async associatePermissionsToRole(
        roleIds: number[],
        permissionIds: number[],
    ) {
        try {
            const promises = [];
            for (const permissionId of permissionIds) {
                for (const roleId of roleIds) {
                    promises.push(
                        this.createRolePermission(roleId, permissionId),
                    );
                }
            }
            await Promise.all(promises);
            return {
                status: HttpStatus.OK,
                message: 'Successfully associated permissions to role',
            };
        } catch (error) {
            console.error('Failed to associate permissions to role:', error);
            throw new InternalServerErrorException(
                'Failed to associate permissions to role',
            );
        }
    }

    async deleteAssociatePermissionsToRole(
        roleIds: number[],
        permissionIds: number[],
    ) {
        try {
            const promises = [];
            for (const permissionId of permissionIds) {
                for (const roleId of roleIds) {
                    promises.push(
                        this.deleteRolePermission(roleId, permissionId),
                    );
                }
            }
            await Promise.all(promises);
            return {
                status: HttpStatus.OK,
                message: 'Successfully deleted role permissions',
            };
        } catch (error) {
            console.error('Failed to delete role permissions:', error);
            throw new InternalServerErrorException(
                'Failed to delete role permissions',
            );
        }
    }
    async createRolePermission(roleId: number, permissionId: number) {
        try {
            const existingRolePermission =
                await this.rolePermissionRepo.findOneBy({
                    roleId,
                    permissionId,
                });

            if (existingRolePermission) {
                throw new HttpException(
                    'Role Permission already exists',
                    HttpStatus.OK,
                );
            }
            const newRolePermission = this.rolePermissionRepo.create({
                roleId,
                permissionId,
            });
            await this.rolePermissionRepo.save(newRolePermission);
            return {
                status: HttpStatus.OK,
                message: 'Successfully created role permission',
                data: {
                    rolePermission: newRolePermission,
                },
            };
        } catch (error) {
            console.error('Failed to create role permission:', error);
            throw new InternalServerErrorException(
                'Failed to create role permission',
            );
        }
    }
    async deleteRolePermission(roleId: number, permissionId: number) {
        const existingRolePermission = await this.rolePermissionRepo.findOneBy({
            roleId,
            permissionId,
        });
        if (!existingRolePermission) {
            throw new HttpException(
                'Role Permission does not exist',
                HttpStatus.OK,
            );
        }
        await this.rolePermissionRepo.delete({ roleId, permissionId });
        return {
            status: HttpStatus.OK,
            message: 'Successfully deleted role permission',
        };
    }
}
