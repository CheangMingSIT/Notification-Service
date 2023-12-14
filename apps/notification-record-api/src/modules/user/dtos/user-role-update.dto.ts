import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class UserUpdateDto {
    @IsNumber()
    @ApiProperty({ type: Number, minimum: 1 })
    roleId: number;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ type: String, format: 'email' })
    email: string;
}
