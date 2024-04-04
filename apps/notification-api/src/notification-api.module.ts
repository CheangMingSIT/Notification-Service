import { ValidateKeyModule } from '@app/auth';
import { MongoDBModule, PostgresDBModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailApiModule } from './modules/email-api/email-api.module';
import { SmsApiModule } from './modules/sms-api/sms-api.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongoDBModule,
        PostgresDBModule,
        EmailApiModule,
        SmsApiModule,
        ValidateKeyModule,
    ],
})
export class NotificationApiModule {}
