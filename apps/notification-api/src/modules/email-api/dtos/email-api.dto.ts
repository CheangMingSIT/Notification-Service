import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsDate,
} from 'class-validator';

export class emailInputDto {
    @IsEmail()
    @IsNotEmpty()
    from: string;

    @IsEmail()
    @IsNotEmpty()
    to: string;

    @IsEmail()
    @IsOptional()
    cc: string;

    @IsEmail()
    @IsOptional()
    bcc: string;

    @IsString()
    @IsOptional()
    subject: string;

    @IsString()
    @IsOptional()
    body: string;

    @IsNumber()
    @IsOptional()
    template: number;
}

export class email extends emailInputDto {
    @IsDate()
    timestamp: Date;
}
