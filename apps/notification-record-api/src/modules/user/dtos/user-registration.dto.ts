import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class userRegistrationDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
