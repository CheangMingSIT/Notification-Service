import { EmailApiService } from './email-api.service';
import { EmailApiController } from './email-api.controller';
import { NotificationLog, NotificationLogSchema } from '@app/common';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMqModule } from '@app/common';

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
