import { Body, Controller, Post, UseFilters } from '@nestjs/common';

import { HttpExceptionFilter, NOTIFICATIONAPI } from '@app/common';
import { ApiTags } from '@nestjs/swagger';
import { smsInputDto } from './dtos/sms.dto';
import { SmsApiService } from './sms-api.service';

@Controller({ version: '1', path: NOTIFICATIONAPI })
@ApiTags('SMS')
export class SmsApiController {
    constructor(private readonly smsApiService: SmsApiService) {}

    @Post('/SMS')
    @UseFilters(HttpExceptionFilter)
    async sendSMS(
        @Body() body: smsInputDto,
    ): Promise<{ success: string; message: string }> {
        const response = await this.smsApiService.publishSMS(body);
        return {
            success: response.response,
            message: response.message,
        };
    }
}
