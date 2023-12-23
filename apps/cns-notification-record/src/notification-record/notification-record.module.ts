import { CaslAbilityModule } from '@app/auth';
import { NotificationLog, NotificationLogSchema } from '@app/common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationRecordController } from './notification-record.controller';
import { NotificationRecordService } from './notification-record.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: NotificationLog.name, schema: NotificationLogSchema },
        ]),
        CaslAbilityModule,
    ],
    controllers: [NotificationRecordController],
    providers: [NotificationRecordService],
})
export class NotificationRecordModule {}
