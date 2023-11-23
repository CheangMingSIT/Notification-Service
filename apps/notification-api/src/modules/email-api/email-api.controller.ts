import { Body, Controller, Post, UseFilters } from '@nestjs/common';

import { EmailApiService } from './email-api.service';
import { NOTIFICATIONAPI } from '@app/common';
import { emailInputDto } from './dtos/email-api.dto';
import { HttpExceptionFilter } from '../../http-exception.filter';

@Controller(NOTIFICATIONAPI)
export class EmailApiController {
    constructor(private readonly emailApiService: EmailApiService) {}

    @Post('/email')
    @UseFilters(HttpExceptionFilter)
    async publishEmail(
        @Body() body: emailInputDto,
    ): Promise<{ success: string; message: string }> {
        const response = await this.emailApiService.publishEmail(body);
        return {
            success: response.response,
            message: response.message,
        };
    }
}
