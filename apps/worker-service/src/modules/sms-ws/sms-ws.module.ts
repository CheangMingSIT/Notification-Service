import { Module } from '@nestjs/common';
import { SmsWsController } from './sms-ws.controller';
import { SmsWsService } from './sms-ws.service';
import { RabbitMqModule } from '@app/common';

@Module({
    imports: [RabbitMqModule],
    controllers: [SmsWsController],
    providers: [SmsWsService],
})
export class SmsWsModule {}
