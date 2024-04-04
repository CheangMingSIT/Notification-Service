import { Operation, Resource } from '@app/auth';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class PermissionDto {
    @ApiPropertyOptional({ enum: Operation })
    @IsEnum(Operation, {
        message:
            'Operation must be either manage, create, read, update or delete',
    })
    @IsOptional()
    operation: Operation;

    @ApiPropertyOptional({ enum: Resource })
    @IsEnum(Resource, {
        message:
            'Resource must be either User, ApiKey, NotificationLog, Permission, RolePermission or all',
    })
    @IsOptional()
    resource: Resource;
}
