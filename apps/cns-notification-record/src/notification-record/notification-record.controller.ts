import {
    Actions,
    ApiAuthGuard,
    AppAbility,
    CheckPolicies,
    PolicyGuard,
} from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import { Controller, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RecordDto } from './dtos/record.dto';
import { NotificationRecordService } from './notification-record.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiTags('Notification Record')
export class NotificationRecordController {
    constructor(
        private readonly notificationRecord: NotificationRecordService,
    ) {}

    @Get('fetchRecord')
    @ApiSecurity('ApiKeyAuth')
    @ApiBearerAuth()
    @UseGuards(ApiAuthGuard, PolicyGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Actions.Read, 'NotificationRecord'),
    )
    async fetchNotificationLog(@Query() query: RecordDto) {
        const response =
            await this.notificationRecord.fetchNotificationLog(query);
        return response;
    }
}
