import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { SMS_SERVICE } from '@app/common';

import { SmsApiController } from './sms-api.controller';
import { SmsApiService } from './sms-api.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: SMS_SERVICE,
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5673'],
                    queue: 'SMS-Queue',
                },
            },
        ]),
    ],
    controllers: [SmsApiController],
    providers: [SmsApiService],
})
export class SmsApiModule {}
