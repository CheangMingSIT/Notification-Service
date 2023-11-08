import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationApiService {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationService: ClientProxy,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async sendEmail(message: string) {
    this.notificationService.emit('notification.email', message);
    return message;
  }
}
