import {
    ApiAuthGuard,
    CheckPolicies,
    JwtAuthGuard,
    Operation,
    PolicyGuard,
} from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import {
    Controller,
    Get,
    Headers,
    HttpStatus,
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
    @UseGuards(ApiAuthGuard, PolicyGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) =>
        ability.can(Operation.Read, 'NotificationRecord'),
    )
    async notificationRecords(
        @Request() req: any,
        @Headers('secretKey') secretKey: any,
        @Query() query: RecordDto,
    ) {
        if (query.endDate)
            query.endDate = new Date(`${query.endDate}T23:59:59.999Z`);
        const res = await this.notificationRecord.retrieveRecord(
            req.user,
            secretKey,
            query,
        );
        return res;
    }

    @Get('todayRecords')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) =>
        ability.can(Operation.Read, 'NotificationRecord'),
    )
    async todayRecords(@Request() req: any) {
        const res = await this.notificationRecord.countTodayRecord(req.user);
        return {
            status: HttpStatus.OK,
            count: res,
        };
    }

    @Get('todayMessageInQueue')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) =>
        ability.can(Operation.Read, 'NotificationRecord'),
    )
    async todayMessageInQueue(@Request() req: any) {
        const res = await this.notificationRecord.countTodayMessageInQueue(
            req.user,
        );
        return {
            status: HttpStatus.OK,
            count: res,
        };
    }

    @Get('todayFailedMessage')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) =>
        ability.can(Operation.Read, 'NotificationRecord'),
    )
    async todayFailedMessage(@Request() req: any) {
        const res = await this.notificationRecord.countFailedMessage(req.user);
        return {
            status: HttpStatus.OK,
            count: res,
        };
    }

    @Get('MonthlyRecord')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) =>
        ability.can(Operation.Read, 'NotificationRecord'),
    )
    async monthlyRecord(@Request() req: any) {
        const res = await this.notificationRecord.countSentTotalMessage(
            req.user,
        );
        return {
            status: HttpStatus.OK,
            data: res,
        };
    }

    @Get('MonthlyUndeliveredRecord')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) =>
        ability.can(Operation.Read, 'NotificationRecord'),
    )
    async monthlyUndeliveredMessage(@Request() req: any) {
        const res = await this.notificationRecord.countTotalUndeliveredMessage(
            req.user,
        );
        return {
            status: HttpStatus.OK,
            data: res,
        };
    }
}
