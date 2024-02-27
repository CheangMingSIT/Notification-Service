import { ApiAuthGuard } from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import {
    Controller,
    Get,
    Headers,
    Query,
    Request,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RecordDto } from './dtos/record.dto';
import { NotificationRecordService } from './notification-record.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiTags('Notification Record')
export class NotificationRecordController {
    constructor(
        private readonly notificationRecord: NotificationRecordService,
    ) {}

    @Get()
    @ApiBearerAuth()
    @ApiSecurity('ApiKeyAuth')
    @UseGuards(ApiAuthGuard)
    @UseFilters(HttpExceptionFilter)
    async abacCheck(
        @Request() req: any,
        @Headers('secretKey') secretKey: any,
        @Query() query: RecordDto,
    ) {
        const res = await this.notificationRecord.retrieveRecord(
            req.user,
            secretKey,
            query,
        );
        return res;
    }
}
