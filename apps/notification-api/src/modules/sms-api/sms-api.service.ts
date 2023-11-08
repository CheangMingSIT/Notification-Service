import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { SMS_SERVICE, sms } from '@app/common';

@Injectable()
export class SmsApiService {
    constructor(
        @Inject(SMS_SERVICE)
        private readonly smsService: ClientProxy,
    ) {}

    sendSMS(message: string) {
        this.smsService.emit(sms, message);
        return message;
    }
}
