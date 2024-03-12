import { PaginationDto } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class RecordDto extends PaginationDto {
    @ApiProperty({ type: 'string', required: false, format: 'uuid' })
    @IsOptional()
    _id: string;

    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    secretKey: string[];

    @ApiProperty({
        type: Date,
        required: false,
        format: 'date',
    })
    @IsOptional()
    @IsDateString()
    startDate: Date;

    @ApiProperty({
        type: Date,
        required: false,
        format: 'date',
    })
    @IsOptional()
    @IsDateString()
    endDate: Date;
}
