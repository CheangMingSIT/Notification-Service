import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EmailInputDto {
    @ApiProperty({ type: String, format: 'email' })
    @IsEmail()
    @IsNotEmpty()
    from: string;

    @ApiProperty({
        type: Array,
        items: { type: 'string', format: 'email' },
    })
    @IsNotEmpty()
    @IsEmail({}, { each: true })
    to: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail({}, { each: true })
    cc: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail({}, { each: true })
    bcc: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    subject: string;

    @ApiProperty({ type: String, format: 'Body' })
    @IsString()
    @IsOptional()
    body: string;

    @ApiPropertyOptional({
        type: 'array',
        items: { type: 'string', format: 'binary' },
    })
    @IsOptional()
    files: any[];
}
