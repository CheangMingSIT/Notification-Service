import { Module } from '@nestjs/common';
import { NotificationApiController } from './notification-api.controller';
import { NotificationApiService } from './notification-api.service';
import { Transport, ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5673'],
          queue: 'email_queue',
        },
      },
    ]),
  ],
  controllers: [NotificationApiController],
  providers: [NotificationApiService],
})
export class NotificationApiModule {}
