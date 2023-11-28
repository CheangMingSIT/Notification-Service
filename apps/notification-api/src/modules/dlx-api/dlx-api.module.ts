import { Module } from '@nestjs/common';
import { DlxApiService } from './dlx-api.service';
import { DlxApiController } from './dlx-api.controller';
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
    providers: [DlxApiService],
    controllers: [DlxApiController],
})
export class DlxApiModule {}
