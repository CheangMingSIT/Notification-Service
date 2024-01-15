import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PermissionDto {
    @ApiProperty({ type: String, format: 'action' })
    @IsString()
    @IsNotEmpty({ message: 'Action is required' })
    action: string;

    @ApiProperty({ type: String, format: 'subject' })
    @IsString()
    @IsNotEmpty({ message: 'Subject is required' })
    subject: string;
}
