import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UserRoleIdDto {
    @IsNumber()
    @ApiProperty({ type: Number, minimum: 1 })
    roleId: number;
}
