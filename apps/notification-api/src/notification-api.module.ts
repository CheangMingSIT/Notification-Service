import { Module } from '@nestjs/common';
import { EmailApiModule } from './modules/email-api/email-api.module';
import { SmsApiModule } from './modules/sms-api/sms-api.module';
import { DatabaseModule } from '@app/common';
import { DlxApiModule } from './modules/dlx-api/dlx-api.module';

@Module({
    imports: [DatabaseModule, EmailApiModule, SmsApiModule, DlxApiModule],
})
export class NotificationApiModule {}
