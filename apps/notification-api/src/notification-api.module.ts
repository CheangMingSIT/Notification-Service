import { Module } from '@nestjs/common';
import { EmailApiModule } from './modules/email-api/email-api.module';
import { SmsApiModule } from './modules/sms-api/sms-api.module';
import { DatabaseModule } from '@app/common';

@Module({
    imports: [DatabaseModule, EmailApiModule, SmsApiModule],
})
export class NotificationApiModule {}
