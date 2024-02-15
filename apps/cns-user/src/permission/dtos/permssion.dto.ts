import { Actions, SubjectsType } from '@app/auth';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional } from 'class-validator';

export class PermissionDto {
    @ApiPropertyOptional({ enum: Actions })
    @IsEnum(Actions, {
        message: 'Action must be either manage, create, read, update or delete',
    })
    @IsOptional()
    action: Actions;

    @ApiPropertyOptional({ enum: SubjectsType })
    @IsEnum(SubjectsType, {
        message:
            'Subject must be either User, ApiKey, NotificationRecord, Permission, RolePermission or all',
    })
    @IsOptional()
    subject: string;

    @ApiPropertyOptional({ type: 'object' })
    @IsObject()
    @IsOptional()
    conditions: object;
}
