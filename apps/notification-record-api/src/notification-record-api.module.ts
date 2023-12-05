import { Module } from '@nestjs/common';
import { ApiAuthModule, DatabaseModule } from '@app/common';
import { NotificationRecordModule } from './modules/notification-record-api/notification-record.module';

@Module({
    imports: [DatabaseModule, NotificationRecordModule],
})
export class NotificationRecordApiModule {}
