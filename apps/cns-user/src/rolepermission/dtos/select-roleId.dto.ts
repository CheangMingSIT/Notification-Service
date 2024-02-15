import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class SelectRoleIdDto {
    @ApiProperty({ type: Number })
    @IsNumberString()
    @IsNotEmpty({ message: 'RoleId is required' })
    roleId: number;
}
