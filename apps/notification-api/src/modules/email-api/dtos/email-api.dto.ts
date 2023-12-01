import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsArray,
    IsNumberString,
} from 'class-validator';

export class emailInputDto {
    @IsEmail()
    @IsNotEmpty()
    from: string;

    @IsArray()
    @IsEmail({}, { each: true })
    to: string;

    @IsOptional()
    @IsArray()
    @IsEmail({}, { each: true })
    cc: string[];

    @IsEmail()
    @IsOptional()
    bcc: string;

    @IsString()
    @IsOptional()
    subject: string;

    @IsString()
    @IsOptional()
    body: string;

    @IsNumberString()
    @IsOptional()
    template: number;
}
