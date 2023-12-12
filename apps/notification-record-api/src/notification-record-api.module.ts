import { MongoDBModule, PostgresDBModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiAuthModule } from './modules/api-auth/api-auth.module';
import { NotificationRecordModule } from './modules/notification-record-api/notification-record.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongoDBModule,
        PostgresDBModule,
        UserModule,
        ApiAuthModule,
        NotificationRecordModule,
    ],
})
export class NotificationRecordApiModule {}
