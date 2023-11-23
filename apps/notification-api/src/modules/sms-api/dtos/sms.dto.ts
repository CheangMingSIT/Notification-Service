import { IsNotEmpty, IsString, IsDate, IsPhoneNumber } from 'class-validator';

export class smsInputDto {
    @IsNotEmpty()
    @IsPhoneNumber('SG', { message: 'sender must be a valid phone number' })
    sender: string;

    @IsNotEmpty()
    @IsPhoneNumber('SG', { message: 'recipient must be a valid phone number' })
    recipient: string;
 
    @IsNotEmpty()
    @IsString()
    body: string;
}

export class sms extends smsInputDto {
    @IsDate()
    @IsNotEmpty()
    timestamp: Date;
}
