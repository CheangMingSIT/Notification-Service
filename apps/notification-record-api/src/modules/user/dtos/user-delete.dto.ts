import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDeleteDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
