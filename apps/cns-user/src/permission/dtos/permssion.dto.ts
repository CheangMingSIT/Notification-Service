import { Actions } from '@app/auth';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
} from 'class-validator';

export class PermissionDto {
    @ApiProperty({ enum: Actions })
    @IsEnum(Actions, {
        message: 'Action must be either create, read, update or delete',
    })
    @IsNotEmpty({ message: 'Action is required' })
    action: Actions;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty({ message: 'Subject is required' })
    subject: string;

    @ApiPropertyOptional({ type: 'object' })
    @IsObject()
    @IsOptional()
    conditions: object;
}
