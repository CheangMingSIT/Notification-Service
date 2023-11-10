import { Module } from '@nestjs/common';

import { EmailApiService } from './email-api.service';
import { EmailApiController } from './email-api.controller';
import { RabbitMqModule } from '@app/common/rabbit-mq/rabbit-mq.module';
@Module({
    imports: [RabbitMqModule],
    controllers: [EmailApiController],
    providers: [EmailApiService],
})
export class EmailApiModule {}
