import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class PermissionIdDto {
    @ApiProperty({ type: Number, format: 'permissionId' })
    @IsNumberString()
    @IsNotEmpty({ message: 'Permission Id is required' })
    permissionId: string;
}
