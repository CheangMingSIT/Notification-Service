import { Module } from '@nestjs/common';

import { EmailApiService } from './email-api.service';
import { EmailApiController } from './email-api.controller';
import { RabbitMqModule } from '@app/common/rabbit-mq/rabbit-mq.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationLog, NotificationLogSchema } from '@app/common/database';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: NotificationLog.name, schema: NotificationLogSchema }]),
        RabbitMqModule,
    ],
    controllers: [EmailApiController],
    providers: [EmailApiService],
})
export class EmailApiModule {}
