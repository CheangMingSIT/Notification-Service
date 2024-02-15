import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { RecordDto } from './record.dto';

export class AdminViewRecords extends RecordDto {
    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    userId: string;
}
