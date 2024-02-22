import {
    Actions,
    ApiAuthGuard,
    AppAbility,
    CaslAbilityFactory,
    CheckPolicies,
    JwtAuthGuard,
    PolicyGuard,
} from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import {
    Controller,
    ForbiddenException,
    Get,
    Headers,
    Query,
    Request,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AdminViewRecords } from './dtos/admin-view-records.dto';
import { RecordDto } from './dtos/record.dto';
import { NotificationRecordService } from './notification-record.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiTags('Notification Record')
export class NotificationRecordController {
    constructor(
        private readonly notificationRecord: NotificationRecordService,
        private caslAbilityFactory: CaslAbilityFactory,
    ) {}

    @Get('fetchRecord')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    async readLog(@Request() req, @Query() query: RecordDto) {}

    @Get('fetchRecordByUserId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Actions.Read, 'NotificationLog'),
    )
    async fetchNotificationLog(@Request() req, @Query() query: RecordDto) {
        try {
            const response = await this.notificationRecord.fetchByUserId(
                req.user.userId,
                query,
            );
            return response;
        } catch (error) {
            console.error(error);
            throw new ForbiddenException('Forbidden');
        }
    }

    @Get('fetchRecordByApiKey')
    @ApiSecurity('ApiKeyAuth')
    @UseFilters(HttpExceptionFilter)
    @UseGuards(ApiAuthGuard)
    async fetchNotificationLogByApiKey(
        @Headers() headers,
        @Query() query: RecordDto,
    ) {
        if (!headers.secretkey) {
            throw new ForbiddenException('Missing secret key');
        }
        try {
            const response = await this.notificationRecord.fetchByApiKey(
                headers.secretkey,
                query,
            );
            return response;
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            } else {
                console.error(error);
                throw new ForbiddenException('Forbidden');
            }
        }
    }

    @Get('fetchRecordsByAdmin')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Actions.Read, 'ViewAllNotificationLog'),
    )
    async fetchNotificationLogByAdmin(@Query() query: AdminViewRecords) {
        try {
            const response = await this.notificationRecord.fetchByAdmin(query);
            return response;
        } catch (error) {
            console.error(error);
            throw new ForbiddenException('Forbidden');
        }
    }
}
