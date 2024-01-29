import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class PermissionRoleDto {
    @ApiProperty({ type: [Number], isArray: true })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsNotEmpty({ message: 'RoleId is required' })
    roleId: number[];

    @ApiProperty({ type: [Number], isArray: true })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsNotEmpty({ message: 'PermissionId is required' })
    permissionId: number[];
}
