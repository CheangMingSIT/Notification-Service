import { RK_NOTIFICATION_SMS } from '@app/common';
import { RabbitmqService } from '@app/common/rabbit-mq/rabbit-mq.service';
import { Injectable } from '@nestjs/common';
import { sms } from './dtos/sms.dto';

@Injectable()
export class SmsApiService {
    constructor(private readonly rabbitMQService: RabbitmqService) {}

    async publishSMS(body: sms) {
        await this.rabbitMQService.publish(RK_NOTIFICATION_SMS, body);
        return body;
    }
}
