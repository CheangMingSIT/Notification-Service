import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NotificationRecordService } from './notification-record.service';
import { NOTIFICATIONAPI } from '@app/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('fetchNotificationLog')
export class NotificationRecordController {
    constructor(
        private readonly notificationRecord: NotificationRecordService,
    ) {}

    @Get()
    @UseGuards(AuthGuard('headerapikey'))
    async fetchNotificationLog(
        @Query() query: { recipient: string[]; sender: string[] },
    ) {
        const response =
            await this.notificationRecord.fetchNotificationLog(query);
        return response;
    }
}
