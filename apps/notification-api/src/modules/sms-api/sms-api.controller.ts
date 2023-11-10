import { Body, Controller, Post } from '@nestjs/common';

import { SmsApiService } from './sms-api.service';

import { NOTIFICATIONAPI } from '@app/common';

@Controller(NOTIFICATIONAPI)
export class SmsApiController {
    constructor(private readonly smsApiService: SmsApiService) {}

    @Post('/SMS')
    sendSMS(
        @Body()
        body: {
            id: number;
            timestamp: Date;
            sender: string;
            recipient: string;
            message: string;
        },
    ) {
        const acknowledgement = this.smsApiService.publishSMS(body);
        return acknowledgement;
    }
}
