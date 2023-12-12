import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class UserUpdateDto {
    @IsNumber()
    roleId: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}
