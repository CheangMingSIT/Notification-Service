import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchTokenDto {
    @ApiPropertyOptional({ type: String, format: 'name' })
    @IsString()
    @IsOptional()
    name: string;
}
