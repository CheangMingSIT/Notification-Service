import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { NotificationRecordModule } from './modules/notification-record-api/notification-record.module';
import { UserModule } from './modules/user/user.module';
import { ApiAuthModule } from './modules/api-auth/api-auth.module';

@Module({
    imports: [
        DatabaseModule,
        UserModule,
        ApiAuthModule,
        NotificationRecordModule,
    ],
})
export class NotificationRecordApiModule {}
