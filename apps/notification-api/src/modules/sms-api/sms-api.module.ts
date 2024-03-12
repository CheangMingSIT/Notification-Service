import {
    ApiKey,
    NotificationLog,
    NotificationLogSchema,
    RabbitMqModule,
    Role,
    User,
} from '@app/common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsApiController } from './sms-api.controller';
import { SmsApiService } from './sms-api.service';

@Module({
    imports: [
        RabbitMqModule,
        MongooseModule.forFeature([
            { name: NotificationLog.name, schema: NotificationLogSchema },
        ]),
        TypeOrmModule.forFeature([ApiKey, User, Role], 'postgres'),
    ],
    controllers: [SmsApiController],
    providers: [SmsApiService],
})
export class SmsApiModule {}
