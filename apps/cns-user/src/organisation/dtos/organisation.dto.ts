import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class organisationDto {
    @ApiProperty({ type: String, format: 'name' })
    @IsNotEmpty({ message: 'Organisation Name cannot be empty' })
    @IsString()
    name: string;
}
