import { PaginationDto } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UserListDto extends PaginationDto {
    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    name: string;

    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    role: string;
}
