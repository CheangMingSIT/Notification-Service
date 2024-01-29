import { Actions } from '@app/auth';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class PermissionDto {
    @ApiProperty({ enum: Actions, format: 'action' })
    @IsEnum(Actions, {
        message: 'Action must be either create, read, update or delete',
    })
    @IsNotEmpty({ message: 'Action is required' })
    action: Actions;

    @ApiProperty({ type: String, format: 'subject' })
    @IsString()
    @IsNotEmpty({ message: 'Subject is required' })
    subject: string;
}
