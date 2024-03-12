import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class organisationDto {
    @ApiProperty({ type: String, format: 'name' })
    @IsNotEmpty({ message: 'Organisation Name cannot be empty' })
    @IsString()
    name: string;

    @ApiPropertyOptional({
        type: Object,
        format: 'condition',
        properties: {
            condition: { type: 'string' },
            operator: { enum: ['equal', 'not equal'] },
            value: { type: 'string' },
        },
        example: {
            condition: 'condition',
            operator: 'equal / not equal',
            value: 'value',
        },
    })
    @IsObject()
    @IsOptional()
    condition: {
        condition: string;
        operator: string;
        value: string;
    };
}
