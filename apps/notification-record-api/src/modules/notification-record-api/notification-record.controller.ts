import { Actions, AppAbility, CheckPolicies, PolicyGuard } from '@app/auth';
import { NOTIFICATIONAPI } from '@app/common';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiAuthGuard } from '../api-auth/guard/api-auth.guard';
import { NotificationRecordService } from './notification-record.service';

@Controller(NOTIFICATIONAPI)
export class NotificationRecordController {
    constructor(
        private readonly notificationRecord: NotificationRecordService,
    ) {}

    @Get('fetchRecord')
    @UseGuards(ApiAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Actions.Read, 'NotificationRecord'),
    )
    async fetchNotificationLog(
        @Query() query: { recipient: string[]; sender: string[] },
    ) {
        const response =
            await this.notificationRecord.fetchNotificationLog(query);
        return response;
    }
}
