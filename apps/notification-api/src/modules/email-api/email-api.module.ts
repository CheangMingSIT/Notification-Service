import {
    ApiKey,
    NotificationLog,
    NotificationLogSchema,
    RabbitMqModule,
    Role,
    User,
} from '@app/common';
import { EmailApiController } from './email-api.controller';
import { EmailApiService } from './email-api.service';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        RabbitMqModule,
        MulterModule.register({
            limits: {
                fileSize: 16000000,
            },
        }),
        MongooseModule.forFeature([
            { name: NotificationLog.name, schema: NotificationLogSchema },
        ]),
        TypeOrmModule.forFeature([ApiKey, User, Role], 'postgres'),
    ],
    controllers: [EmailApiController],
    providers: [EmailApiService],
})
export class EmailApiModule {}
