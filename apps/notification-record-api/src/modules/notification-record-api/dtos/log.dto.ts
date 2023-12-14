import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class LogDto {
    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    recipient: string[];

    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    sender: string[];
}
