import { Module } from '@nestjs/common';

import { EmailApiService } from './email-api.service';
import { EmailApiController } from './email-api.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationLog, NotificationLogSchema } from '@app/common/database';
import { RabbitMqModule, RabbitmqService } from '@app/common';
@Module({
    imports: [
        RabbitMqModule,
        MongooseModule.forFeature([
            { name: NotificationLog.name, schema: NotificationLogSchema },
        ]),
    ],
    controllers: [EmailApiController],
    providers: [EmailApiService],
})
export class EmailApiModule {}
