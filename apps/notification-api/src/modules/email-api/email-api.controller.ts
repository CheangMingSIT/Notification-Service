import { Body, Controller, Post } from '@nestjs/common';

import { EmailApiService } from './email-api.service';

import { NOTIFICATIONAPI } from '@app/common';

@Controller(NOTIFICATIONAPI)
export class EmailApiController {
    constructor(private readonly emailApiService: EmailApiService) {}

    @Post('/email')
    sendEmail(@Body() body: any) {
        const acknowledgement = this.emailApiService.sendEmail(body.message);
        return acknowledgement;
    }
}
