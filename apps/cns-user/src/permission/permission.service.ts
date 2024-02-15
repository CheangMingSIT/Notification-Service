import { Permission } from '@app/common';
import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionListDto } from './dtos/permission-list.dto';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission, 'postgres')
        private permissionRepo: Repository<Permission>,
    ) {}

    async listPermissions(query: PermissionListDto): Promise<any> {
        const { page, limit, action, subject } = query;
        try {
            const permissions = await this.permissionRepo.find({
                where: {
                    action: action ? action : undefined,
                    subject: subject ? subject : undefined,
                },
                skip: (page - 1) * limit,
                take: limit,
            });
            const payload = permissions.map((permission) => {
                return {
                    action: permission.action,
                    subject: permission.subject,
                };
            });
            return {
                data: {
                    permissions: payload,
                    page: page,
                    limit: limit,
                },
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async createPermission(body: {
        action: string;
        subject: string;
        conditions: object;
    }) {
        const { action, subject, conditions } = body;
        try {
            const newPermission = this.permissionRepo.create({
                action,
                subject,
                conditions,
            });
            await this.permissionRepo.save(newPermission);
            return 'Permission created successfully';
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async updatePermission(
        permissionId: number,
        body: { action: string; subject: string; conditions: object },
    ) {
        const { action, subject, conditions } = body;
        try {
            const existingPermission = await this.permissionRepo.findOneBy({
                permissionId,
            });
            if (!existingPermission) {
                throw new BadRequestException('Permission does not exist');
            }
            await this.permissionRepo.update(existingPermission.permissionId, {
                action,
                subject,
                conditions,
            });
            return 'Permission updated successfully';
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async deletePermission(permissionId: number) {
        const existingPermission = await this.permissionRepo.findOneBy({
            permissionId,
        });
        if (!existingPermission) {
            throw new HttpException(
                'Permission does not exists',
                HttpStatus.OK,
            );
        }
        try {
            await this.permissionRepo.delete(existingPermission.permissionId);
            return 'Permission deleted successfully';
        } catch (error) {
            throw new BadRequestException(
                'There is an existing role tied to this permission. Please remove the associated permission from the role before deleting the permission.',
            );
        }
    }
}
