import { Module } from '@nestjs/common';
import { SmsApiController } from './sms-api.controller';
import { SmsApiService } from './sms-api.service';
import {
    NotificationLog,
    NotificationLogSchema,
    RabbitMqModule,
} from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        RabbitMqModule,
        MongooseModule.forFeature([
            { name: NotificationLog.name, schema: NotificationLogSchema },
        ]),
    ],
    controllers: [SmsApiController],
    providers: [SmsApiService],
})
export class SmsApiModule {}
