import { Body, Controller, Post, UseFilters } from '@nestjs/common';

import { sms, smsInputDto } from './dtos/sms.dto';
import { SmsApiService } from './sms-api.service';
import { HttpExceptionFilter } from '../../http-exception.filter';

//library/common
import { NOTIFICATIONAPI } from '@app/common';

@Controller(NOTIFICATIONAPI)
export class SmsApiController {
    constructor(private readonly smsApiService: SmsApiService) { }

    @Post('/SMS')
    @UseFilters(HttpExceptionFilter)
    async sendSMS(
        @Body() body: smsInputDto,
    ): Promise<{ success: boolean; message: string }> {
        const timestamp = new Date();
        const sms: sms = { ...body, timestamp };
        await this.smsApiService.publishSMS(sms);
        return {
            success: true,
            message: 'SMS added to the queue successfully',
        };

    }
}
