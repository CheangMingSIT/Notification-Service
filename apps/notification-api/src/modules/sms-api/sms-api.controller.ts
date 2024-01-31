import {
    Body,
    Controller,
    Headers,
    Post,
    UseFilters,
    UseGuards,
} from '@nestjs/common';

import { ApiAuthGuard } from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONAPI } from '@app/common';
import { ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SmsInputDto } from './dtos/sms.dto';
import { SmsApiService } from './sms-api.service';

@Controller({ version: '1', path: NOTIFICATIONAPI })
@ApiTags('SMS')
export class SmsApiController {
    constructor(private readonly smsApiService: SmsApiService) {}

    @Post('/SMS')
    @ApiConsumes('multipart/form-data')
    @ApiSecurity('ApiKeyAuth')
    @UseGuards(ApiAuthGuard)
    @UseFilters(HttpExceptionFilter)
    async sendSMS(
        @Body() body: SmsInputDto,
        @Headers() headers: Record<string, string>,
    ): Promise<{ success; message }> {
        const response = await this.smsApiService.publishSMS(
            body,
            headers.apikey,
        );
        return {
            success: response.status,
            message: response.message,
        };
    }
}
