import { Module } from '@nestjs/common';
import { EmailApiModule } from './modules/email-api/email-api.module';
import { SmsApiModule } from './modules/sms-api/sms-api.module';
import { MongoDBModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongoDBModule,
        EmailApiModule,
        SmsApiModule,
    ],
})
export class NotificationApiModule {}
