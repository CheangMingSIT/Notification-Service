import { NotificationLog, NotificationLogSchema } from '@app/common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationRecordService } from './notification-record.service';
import { NotificationRecordController } from './notification-record.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: NotificationLog.name, schema: NotificationLogSchema },
        ]),
    ],
    controllers: [NotificationRecordController],
    providers: [NotificationRecordService],
})
export class NotificationRecordModule {}
