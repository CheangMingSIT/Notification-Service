import { Module } from '@nestjs/common';
import { EmailWsModule } from './modules/email-ws/email-ws.module';
import { SmsWsModule } from './modules/sms-ws/sms-ws.module';

@Module({
    imports: [EmailWsModule, SmsWsModule],
})
export class WorkerServiceModule {}
