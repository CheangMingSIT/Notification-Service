import { Controller, Get, Query } from '@nestjs/common';
import { NotificationRecordService } from './notification-record.service';
import { NOTIFICATIONAPI } from '@app/common';

@Controller('fetchNotificationLog')
export class NotificationRecordController {
    constructor(
        private readonly notificationRecord: NotificationRecordService,
    ) {}

    @Get()
    async fetchNotificationLog(
        @Query() query: { recipient: string; sender: string },
    ) {
        const response =
            await this.notificationRecord.fetchNotificationLog(query);
        return response;
    }
}
