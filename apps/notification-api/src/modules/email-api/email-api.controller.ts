import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';

import { EmailApiService } from './email-api.service';
import { NOTIFICATIONAPI } from '@app/common';
import { emailInputDto } from './dtos/email-api.dto';
import { HttpExceptionFilter } from '../../http-exception.filter';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(NOTIFICATIONAPI)
export class EmailApiController {
    constructor(private readonly emailApiService: EmailApiService) {}

    @Post('/email')
    @UseInterceptors(FileInterceptor('file'))
    @UseFilters(HttpExceptionFilter)
    async publishEmail(
        @Body() body: emailInputDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<{ success: string; message: string }> {
        const response = await this.emailApiService.publishEmail(body, file);
        return {
            success: response.response,
            message: response.message,
        };
    }
}
