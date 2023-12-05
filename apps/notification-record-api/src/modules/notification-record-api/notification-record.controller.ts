import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { NotificationRecordService } from './notification-record.service';
import { ApiAuthService, NOTIFICATIONAPI } from '@app/common';
import { AuthGuard } from '@nestjs/passport';

@Controller(NOTIFICATIONAPI)
export class NotificationRecordController {
    constructor(
        private readonly notificationRecord: NotificationRecordService,
        private apiAuthService: ApiAuthService,
    ) {}

    @Post('generateToken')
    async generateToken(@Body() body: { uuid: string; username: string }) {
        const response = await this.apiAuthService.generateApiKey(body);
        return response;
    }

    @Get('fetchRecord')
    @UseGuards(AuthGuard('headerapikey'))
    async fetchNotificationLog(
        @Query() query: { recipient: string[]; sender: string[] },
    ) {
        const response =
            await this.notificationRecord.fetchNotificationLog(query);
        return response;
    }
}
