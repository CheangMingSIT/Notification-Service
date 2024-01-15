import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from 'class-validator';

export class UserDto {
    @ApiProperty({ type: String, format: 'name' })
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @ApiProperty({ type: String, format: 'email' })
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({ type: String, format: 'password' })
    @IsStrongPassword()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
