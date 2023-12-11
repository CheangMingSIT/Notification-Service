import { Module } from '@nestjs/common';
import { WsModule } from './modules/ws/ws.module';
import { MongoDBModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        WsModule,
        MongoDBModule,
    ],
})
export class WorkerServiceModule {}
