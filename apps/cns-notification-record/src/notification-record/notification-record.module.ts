import { CaslAbilityModule } from '@app/auth';
import {
    NotificationLog,
    NotificationLogSchema,
    Permission,
    RolePermission,
    User,
} from '@app/common';
import { accessibleRecordsPlugin } from '@casl/mongoose';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationRecordController } from './notification-record.controller';
import { NotificationRecordService } from './notification-record.service';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: NotificationLog.name,
                useFactory: () => {
                    const schema = NotificationLogSchema;
                    schema.plugin(accessibleRecordsPlugin);
                    return schema;
                },
            },
        ]),
        TypeOrmModule.forFeature(
            [User, RolePermission, Permission],
            'postgres',
        ),
        CaslAbilityModule,
    ],
    controllers: [NotificationRecordController],
    providers: [NotificationRecordService],
})
export class NotificationRecordModule {}
