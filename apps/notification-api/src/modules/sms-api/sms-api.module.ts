import { Module } from '@nestjs/common';
import { SmsApiController } from './sms-api.controller';
import { SmsApiService } from './sms-api.service';
import { RabbitMqModule } from '@app/common';

@Module({
    imports: [RabbitMqModule],
    controllers: [SmsApiController],
    providers: [SmsApiService],
})
export class SmsApiModule {}
