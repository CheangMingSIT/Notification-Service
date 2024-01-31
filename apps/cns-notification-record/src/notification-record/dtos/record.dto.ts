import { PaginationDto } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class RecordDto extends PaginationDto {
    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    apikey: string[];

    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    userId: string[];

    @ApiProperty({
        type: Date,
        required: false,
        format: 'date',
        default: new Date().toISOString(),
    })
    @IsOptional()
    @IsDateString()
    startDate: Date;

    @ApiProperty({
        type: Date,
        required: false,
        format: 'date',
        default: new Date().toISOString(),
    })
    @IsOptional()
    @IsDateString()
    endDate: Date;
}
