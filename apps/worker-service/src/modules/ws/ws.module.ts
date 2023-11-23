import { Module } from '@nestjs/common';
import { RabbitMqModule } from '@app/common';
import { WsService } from './ws.service';

@Module({
    imports: [RabbitMqModule],
    providers: [WsService],
})
export class WsModule {}
