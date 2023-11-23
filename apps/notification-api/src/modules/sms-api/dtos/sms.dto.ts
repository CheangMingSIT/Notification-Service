import { IsNotEmpty, IsString, IsDate, IsPhoneNumber, IsNumber } from 'class-validator';

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

    @IsNotEmpty()
    @IsNumber()
    template: number;
}
