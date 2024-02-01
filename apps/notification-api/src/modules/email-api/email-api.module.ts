import {
    ApiKey,
    NotificationLog,
    NotificationLogSchema,
    Permission,
    RabbitMqModule,
    Role,
    RolePermission,
    User,
} from '@app/common';
import { EmailApiController } from './email-api.controller';
import { EmailApiService } from './email-api.service';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        RabbitMqModule,
        MongooseModule.forFeature([
            { name: NotificationLog.name, schema: NotificationLogSchema },
        ]),
        TypeOrmModule.forFeature(
            [ApiKey, User, Role, RolePermission, Permission],
            'postgres',
        ),
    ],
    controllers: [EmailApiController],
    providers: [EmailApiService],
})
export class EmailApiModule {}
