import { Body, Controller, Post, UseFilters } from '@nestjs/common';

import { EmailApiService } from './email-api.service';

import { NOTIFICATIONAPI } from '@app/common';
import { email, emailInputDto } from './dtos/email-api.dto';
import { HttpExceptionFilter } from '../../http-exception.filter';

@Controller(NOTIFICATIONAPI)
export class EmailApiController {
    constructor(private readonly emailApiService: EmailApiService) {}

    @Post('/email')
    @UseFilters(HttpExceptionFilter)
    async publishEmail(
        @Body() body: emailInputDto,
    ): Promise<{ success: boolean; message: string }> {
        const timestamp = new Date();
        const email: email = { ...body, timestamp };
        await this.emailApiService.publishEmail(email);
        return {
            success: true,
            message: 'Email added to the queue successfully',
        };
    }
}