import { Module } from '@nestjs/common';

import { MongoDBModule, PostgresDBModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { DlxApiModule } from './modules/dlx-api/dlx-api.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongoDBModule,
        PostgresDBModule,
        DlxApiModule,
    ],
})
export class DlxNotificationApiModule {}
