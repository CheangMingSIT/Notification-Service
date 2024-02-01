import { ApiAuthGuard } from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONAPI } from '@app/common';
import {
    Body,
    Controller,
    Headers,
    Post,
    UploadedFiles,
    UseFilters,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { EmailInputDto } from './dtos/email-api.dto';
import { EmailApiService } from './email-api.service';

@Controller({ version: '1', path: NOTIFICATIONAPI })
@ApiTags('Email')
export class EmailApiController {
    constructor(private readonly emailApiService: EmailApiService) {}

    @Post('/email')
    @ApiConsumes('multipart/form-data')
    @ApiSecurity('ApiKeyAuth')
    @UseGuards(ApiAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @UseFilters(HttpExceptionFilter)
    async publishEmail(
        @Headers() headers,
        @Body() body: EmailInputDto,
        @UploadedFiles() file: Array<Express.Multer.File>,
    ): Promise<{ status; message }> {
        const response = await this.emailApiService.publishEmail(
            body,
            file,
            headers.secretkey,
        );
        return {
            status: response.status,
            message: response.message,
        };
    }
}
