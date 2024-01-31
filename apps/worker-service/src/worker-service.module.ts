import { MongoDBModule, PostgresDBModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WsModule } from './modules/ws/ws.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        WsModule,
        MongoDBModule,
        PostgresDBModule,
    ],
})
export class WorkerServiceModule {}
