import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDeleteDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ type: String, format: 'email' })
    email: string;
}
