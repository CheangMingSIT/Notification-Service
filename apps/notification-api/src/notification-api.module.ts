import { Module } from '@nestjs/common';
import { EmailApiModule } from './modules/email-api/email-api.module';
import { SmsApiModule } from './modules/sms-api/sms-api.module';

@Module({
    imports: [EmailApiModule, SmsApiModule],
})
export class NotificationApiModule {}
