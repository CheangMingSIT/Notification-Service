import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateTokenDto {
    @ApiProperty({ type: String, format: 'name' })
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name: string;
}
