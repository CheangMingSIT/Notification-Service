import { Module } from '@nestjs/common';
import { DlxApiController } from './dlx-api.controller';
import { DlxApiService } from './dlx-api.service';
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
    controllers: [DlxApiController],
    providers: [DlxApiService],
})
export class DlxApiModule {}
