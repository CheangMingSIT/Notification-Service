import { EmailApiService } from './email-api.service';
import { EmailApiController } from './email-api.controller';
import { NotificationLog, NotificationLogSchema } from '@app/common/database';

// libs
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMqModule } from '@app/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        RabbitMqModule,
        ScheduleModule.forRoot(),
        MongooseModule.forFeature([
            { name: NotificationLog.name, schema: NotificationLogSchema },
        ]),
    ],
    controllers: [EmailApiController],
    providers: [EmailApiService],
})
export class EmailApiModule {}
