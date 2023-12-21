import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class PaginationDto {
    @ApiProperty({
        required: false,
        minimum: 1,
        maximum: 1000,
        default: 1,
    })
    @IsNumberString()
    page: number;

    @ApiProperty({
        required: false,
        minimum: 1,
        maximum: 1000,
        default: 1,
    })
    @IsNumberString()
    limit: number;
}
