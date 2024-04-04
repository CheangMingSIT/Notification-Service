import { Permission } from '@app/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { groupBy } from 'lodash';
import { Repository } from 'typeorm';
import { PermissionDto } from './dtos/permssion.dto';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission, 'postgres')
        private permissionRepo: Repository<Permission>,
    ) {}

    async listPermissions(query: PermissionDto): Promise<any> {
        const { operation, resource } = query;
        try {
            const permissions = await this.permissionRepo.find({
                where: {
                    operation: operation || undefined,
                    resource: resource || undefined,
                },
                order: { resource: 'ASC' },
            });
            return permissions;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async groupPermissionsByResource(): Promise<any> {
        try {
            const permissions = await this.permissionRepo.find({
                order: { resource: 'ASC' },
                select: ['permissionId', 'operation', 'resource'],
            });

            const groupedPermissions = groupBy(permissions, 'resource');

            const resources = Object.entries(groupedPermissions)
                .map(([resource, permissions]) => {
                    if (resource === 'all') {
                        return null;
                    }

                    return {
                        resource,
                        permissions,
                    };
                })
                .filter(Boolean);

            return resources;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    async createPermission(body: PermissionDto) {
        const { operation, resource } = body;
        try {
            const newPermission = this.permissionRepo.create({
                operation,
                resource,
            });
            await this.permissionRepo.save(newPermission);
            return 'Permission created successfully';
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async updatePermission(permissionId: number, body: PermissionDto) {
        const { operation, resource } = body;
        try {
            const existingPermission = await this.permissionRepo.findOneBy({
                permissionId,
            });
            if (!existingPermission) {
                throw new BadRequestException('Permission does not exist');
            }
            await this.permissionRepo.update(existingPermission.permissionId, {
                operation,
                resource,
            });
            return 'Permission updated successfully';
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
