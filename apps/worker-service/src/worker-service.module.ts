import { Module } from '@nestjs/common';
import { WsModule } from './modules/ws/ws.module';
import { DatabaseModule } from '@app/common';

@Module({
    imports: [WsModule, DatabaseModule],
})
export class WorkerServiceModule {}
