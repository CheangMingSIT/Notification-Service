import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class EmailInputDto {
    @IsEmail()
    @IsNotEmpty()
    from: string;

    @IsNotEmpty()
    @IsEmail({}, { each: true })
    to: string[];

    @IsOptional()
    @IsEmail({}, { each: true })
    cc: string[];

    @IsOptional()
    @IsEmail({}, { each: true })
    bcc: string[];

    @IsString()
    @IsOptional()
    subject: string;

    @IsString()
    @IsOptional()
    body: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    files: any[];
}
