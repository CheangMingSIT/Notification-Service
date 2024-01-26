import { IsArray, IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';

export class smsInputDto {
    @IsNotEmpty()
    @IsMobilePhone(
        'en-SG',
        {},
        {
            message: 'recipient must be a valid phone number',
            each: true,
        },
    )
    sender: string;

    @IsNotEmpty()
    @IsArray()
    @IsMobilePhone(
        'en-SG',
        {},
        {
            message: 'recipient must be a valid phone number',
            each: true,
        },
    )
    recipient: string[];

    @IsNotEmpty()
    @IsString()
    body: string;
}
