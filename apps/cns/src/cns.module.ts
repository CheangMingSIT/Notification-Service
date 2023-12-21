import { MongoDBModule, PostgresDBModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiAuthModule } from './modules/apiKey-auth/api-auth.module';
import { NotificationRecordModule } from './modules/notification-record-api/notification-record.module';
import { UserAuthModule } from './modules/user-auth/user-auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongoDBModule,
        PostgresDBModule,
        UserAuthModule,
        ApiAuthModule,
        UserModule,
        NotificationRecordModule,
    ],
})
export class CnsModule {}
