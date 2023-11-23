import { Module } from '@nestjs/common';
import { WsModule } from './modules/ws/ws.module';


@Module({
    imports: [WsModule],
})
export class WorkerServiceModule {}
