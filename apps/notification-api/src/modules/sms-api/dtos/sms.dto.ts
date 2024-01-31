import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';

export class SmsInputDto {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsMobilePhone(
        'en-SG',
        {},
        { message: 'Sender must be a valid phone number' },
    )
    sender: string;

    @ApiProperty({
        type: [String],
        items: { type: 'string' },
    })
    @IsNotEmpty()
    @IsArray()
    @IsMobilePhone(
        'en-SG',
        {},
        { each: true, message: 'Recipient must be a valid phone number' },
    )
    recipient: string[];

    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    body: string;
}
