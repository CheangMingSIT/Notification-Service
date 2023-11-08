import { Body, Controller, Post } from '@nestjs/common';

import { SmsApiService } from './sms-api.service';

import { NOTIFICATIONAPI } from '@app/common';

@Controller(NOTIFICATIONAPI)
export class SmsApiController {
    constructor(private readonly smsApiService: SmsApiService) {}

    @Post('/SMS')
    sendSMS(@Body() body: any) {
        const acknowledgement = this.smsApiService.sendSMS(body.message);
        return acknowledgement;
    }
}
