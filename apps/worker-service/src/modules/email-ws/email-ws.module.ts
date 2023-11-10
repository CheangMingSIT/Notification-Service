import { Module } from '@nestjs/common';
import { EmailWsController } from './email-ws.controller';
import { RabbitMqModule } from '@app/common';
import { EmailWsService } from './email-ws.service';

@Module({
    imports: [RabbitMqModule],
    controllers: [EmailWsController],
    providers: [EmailWsService],
})
export class EmailWsModule {}
