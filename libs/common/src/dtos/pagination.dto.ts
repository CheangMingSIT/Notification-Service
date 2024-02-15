import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationDto {
    @ApiProperty({
        required: false,
        minimum: 1,
        maximum: 1000,
        default: 1,
    })
    @IsOptional()
    @IsNumberString()
    page: number;

    @ApiProperty({
        required: false,
        minimum: 1,
        maximum: 1000,
        default: 1,
    })
    @IsOptional()
    @IsNumberString()
    limit: number;
}
