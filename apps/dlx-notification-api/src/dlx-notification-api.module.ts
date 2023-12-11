import { Module } from '@nestjs/common';

import { DlxApiModule } from './modules/dlx-api/dlx-api.module';
import { MongoDBModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongoDBModule,
        DlxApiModule,
    ],
})
export class DlxNotificationApiModule {}
