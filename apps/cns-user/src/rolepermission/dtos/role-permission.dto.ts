import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumberString,
    IsString,
} from 'class-validator';

export class RolePermissionDto {
    @ApiProperty({ type: String })
    @IsNotEmpty({ message: 'Role is required' })
    @IsString()
    role: string;

    @ApiProperty({ type: Boolean })
    @IsBoolean()
    hasFullDataControl: boolean;

    @ApiProperty({
        type: [String],
    })
    @IsNumberString({}, { each: true })
    @IsNotEmpty({ message: 'Permission is required' })
    permission: [number];
}
