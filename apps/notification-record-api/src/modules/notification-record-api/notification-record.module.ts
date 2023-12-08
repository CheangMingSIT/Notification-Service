import { NotificationLog, NotificationLogSchema } from '@app/common';
import { UserAuthModule } from '@app/auth';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationRecordService } from './notification-record.service';
import { NotificationRecordController } from './notification-record.controller';
import { ApiAuthModule } from '../api-auth/api-auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: NotificationLog.name, schema: NotificationLogSchema },
        ]),
        ApiAuthModule,
        UserAuthModule,
    ],
    controllers: [NotificationRecordController],
    providers: [NotificationRecordService],
})
export class NotificationRecordModule {}
