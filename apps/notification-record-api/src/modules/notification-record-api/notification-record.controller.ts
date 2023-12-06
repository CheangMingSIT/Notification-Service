import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NotificationRecordService } from './notification-record.service';
import { NOTIFICATIONAPI } from '@app/common';
import { ApiAuthGuard } from '../api-auth/guard/api-auth.guard';
import { JwtAuthGuard } from '@app/common';

@Controller(NOTIFICATIONAPI)
export class NotificationRecordController {
    constructor(
        private readonly notificationRecord: NotificationRecordService,
    ) {}

    @Get('fetchRecord')
    @UseGuards(ApiAuthGuard)
    async fetchNotificationLog(
        @Query() query: { recipient: string[]; sender: string[] },
    ) {
        const response =
            await this.notificationRecord.fetchNotificationLog(query);
        return response;
    }
}
