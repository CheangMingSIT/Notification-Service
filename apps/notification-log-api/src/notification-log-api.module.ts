import { Module } from '@nestjs/common';
import { NotificationRecordModule } from './modules/notification-record/notification-record.module';
import { DatabaseModule } from '@app/common';

@Module({
    imports: [DatabaseModule, NotificationRecordModule],
})
export class NotificationLogApiModule {}
