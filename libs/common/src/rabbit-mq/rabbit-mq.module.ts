import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbit-mq.service';

@Module({
    providers: [RabbitmqService],
    exports: [RabbitmqService],
})
export class RabbitMqModule {}
