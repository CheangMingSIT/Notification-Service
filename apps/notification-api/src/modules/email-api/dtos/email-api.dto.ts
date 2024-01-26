import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString,
} from 'class-validator';

export class emailInputDto {
    @ApiProperty({ type: String, format: 'email' })
    @IsEmail()
    @IsNotEmpty()
    from: string;

    @ApiProperty({ type: String, format: 'email' })
    @IsNotEmpty()
    @IsEmail({}, { each: true })
    to: string[];

    @ApiProperty({ type: Array, format: 'email' })
    @IsOptional()
    @IsEmail({}, { each: true })
    cc: string[];

    @ApiProperty({ type: Array, format: 'email' })
    @IsEmail()
    @IsOptional()
    bcc: string;

    @ApiProperty({ type: String, format: 'Subject' })
    @IsString()
    @IsOptional()
    subject: string;

    @ApiProperty({ type: String, format: 'Body' })
    @IsString()
    @IsOptional()
    body: string;

    @ApiProperty({ type: Number, format: 'Template' })
    @IsNumberString()
    @IsOptional()
    template: number;
}
