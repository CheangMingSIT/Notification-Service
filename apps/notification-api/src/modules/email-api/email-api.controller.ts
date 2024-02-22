import { ApiAuthGuard } from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONAPI } from '@app/common';
import {
    Body,
    Controller,
    Headers,
    HttpStatus,
    Post,
    UploadedFiles,
    UseFilters,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { EmailApiService } from './email-api.service';

@Controller({ version: '1', path: NOTIFICATIONAPI })
@ApiTags('Email')
export class EmailApiController {
    constructor(private readonly emailApiService: EmailApiService) {}

    @Post('/email')
    @UseGuards(ApiAuthGuard)
    @UseInterceptors(AnyFilesInterceptor())
    @UseFilters(HttpExceptionFilter)
    async publishEmail(
        @Headers() headers,
        @Body()
        body: {
            from: string;
            to: [string];
            cc?: string[];
            bcc?: string[];
            subject: string;
            body: string;
        },
        @UploadedFiles()
        files: Array<Express.Multer.File>,
    ): Promise<{ status: HttpStatus; message: string }> {
        const response = await this.emailApiService.publishEmail(
            body,
            files,
            headers.secretkey,
        );
        return response;
    }
}
