import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationApiService } from './notification-api.service';

@Controller('api/v1/notification-api')
export class NotificationApiController {
  constructor(
    private readonly notificationApiService: NotificationApiService,
  ) {}

  @Get()
  getHello(): string {
    return this.notificationApiService.getHello();
  }

  @Post('/email')
  sendEmail(@Body() body: any) {
    const acknowledgement = this.notificationApiService.sendEmail(body.message);
    return acknowledgement;
  }
}
