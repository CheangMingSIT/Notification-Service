import { UserValidationModule, validateKeyModule } from '@app/auth';
import { MongoDBModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationRecordModule } from './notification-record/notification-record.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongoDBModule,
        NotificationRecordModule,
        UserValidationModule,
        validateKeyModule,
    ],
})
export class CnsNotificationRecordModule {}
