import { Body, Controller, Post } from '@nestjs/common';

import { EmailApiService } from './email-api.service';

import { NOTIFICATIONAPI } from '@app/common';

@Controller(NOTIFICATIONAPI)
export class EmailApiController {
    constructor(private readonly emailApiService: EmailApiService) {}

    @Post('/email')
    publishEmail(
        @Body()
        body: {
            id: number;
            date: Date;
            from: string;
            to: string;
            cc: string;
            bcc: string;
            subject: string;
            body: string;
            template: number;
        },
    ) {
        return this.emailApiService.publishEmail(body);
    }
}
