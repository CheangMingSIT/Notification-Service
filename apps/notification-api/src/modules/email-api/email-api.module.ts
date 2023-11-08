import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { EmailApiService } from './email-api.service';
import { EmailApiController } from './email-api.controller';

import { EMAIL_SERVICE } from '@app/common';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: EMAIL_SERVICE,
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5673'],
                    queue: 'EMAIL-Queue',
                },
            },
        ]),
    ],
    controllers: [EmailApiController],
    providers: [EmailApiService],
})
export class EmailApiModule {}
