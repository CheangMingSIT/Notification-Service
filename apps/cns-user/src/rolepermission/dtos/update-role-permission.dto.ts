import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { RolePermissionDto } from './role-permission.dto';

export class updateRolePermissionDto extends PickType(RolePermissionDto, [
    'permission',
] as const) {
    @ApiProperty({ type: Number })
    @IsNumber()
    @IsNotEmpty({ message: 'RoleId is required' })
    roleId: number;
}
