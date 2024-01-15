import { PaginationDto, Permission } from '@app/common';
import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission, 'postgres')
        private permissionRepo: Repository<Permission>,
    ) {}

    async listPermissions(query: PaginationDto): Promise<any> {
        const { page, limit } = query;
        try {
            const permissions = await this.permissionRepo.find({
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
                status: HttpStatus.OK,
                message: 'Successfully fetched permissions',
                data: {
                    permissions: payload,
                    page: page,
                    limit: limit,
                },
            };
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.OK);
        }
    }

    async createPermission(body: {
        action: string;
        subject: string;
    }): Promise<any> {
        const { action, subject } = body;
        const existingPermission = await this.permissionRepo.findOneBy({
            action,
            subject,
        });
        if (existingPermission) {
            throw new HttpException('Permission already exists', HttpStatus.OK);
        }
        const newPermission = this.permissionRepo.create({
            action,
            subject,
        });
        const savePermission = await this.permissionRepo.save(newPermission);
        return savePermission;
    }

    async updatePermission(
        permissionId: string,
        body: { action: string; subject: string },
    ): Promise<any> {
        try {
            const existingPermission = await this.permissionRepo.findOneBy({
                permissionId: parseInt(permissionId),
            });
            if (!existingPermission) {
                throw new HttpException(
                    'Permission does not exist',
                    HttpStatus.OK,
                );
            }
            const updatePermission = await this.permissionRepo.update(
                existingPermission.permissionId,
                body,
            );
            return updatePermission;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    async deletePermission(permissionId: number): Promise<any> {
        const existingPermission = await this.permissionRepo.findOneBy({
            permissionId,
        });
        if (!existingPermission) {
            throw new HttpException(
                'Permission does not exists',
                HttpStatus.OK,
            );
        }
        const deletePermission = await this.permissionRepo.delete(
            existingPermission.permissionId,
        );
        return deletePermission;
    }
}
