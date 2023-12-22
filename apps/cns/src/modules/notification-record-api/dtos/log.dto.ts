import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common/dtos/pagination.dto';

export class LogDto extends PaginationDto {
    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    recipient: string[];

    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    sender: string[];
}
