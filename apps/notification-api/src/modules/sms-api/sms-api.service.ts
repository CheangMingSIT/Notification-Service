import { RK_NOTIFICATION_SMS } from '@app/common';
import { RabbitmqService } from '@app/common/rabbit-mq/rabbit-mq.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsApiService {
    constructor(private readonly rabbitMQService: RabbitmqService) {}

    async publishSMS(body: {
        id: number;
        timestamp: Date;
        sender: string;
        recipient: string;
        message: string;
    }) {
        await this.rabbitMQService.publish(RK_NOTIFICATION_SMS, body);
        return 'sending SMS....';
    }
}
