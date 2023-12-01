import {
    IsNotEmpty,
    IsString,
    IsDate,
    IsPhoneNumber,
    IsArray,
    IsNumberString,
} from 'class-validator';

export class smsInputDto {
    @IsNotEmpty()
    @IsPhoneNumber('SG', { message: 'sender must be a valid phone number' })
    sender: string;

    @IsNotEmpty()
    @IsArray()
    @IsPhoneNumber('SG', {
        message: 'recipient must be a valid phone number',
        each: true,
    })
    recipient: string[];

    @IsNotEmpty()
    @IsString()
    body: string;

    @IsNotEmpty()
    @IsNumberString()
    template: number;
}
