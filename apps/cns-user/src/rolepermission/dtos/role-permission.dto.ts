import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class RolePermissionDto {
    @ApiProperty({ type: String })
    @IsNotEmpty({ message: 'Role is required' })
    role: string;

    @ApiProperty({ type: [Number], isArray: true })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsNotEmpty({ message: 'PermissionId is required' })
    permissionId: number[];
}
