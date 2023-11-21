import { Injectable } from '@nestjs/common';
import { RabbitmqService } from '@app/common/rabbit-mq/rabbit-mq.service';
import { RK_NOTIFICATION_EMAIL } from '@app/common';
import { email } from './dtos/email-api.dto';

@Injectable()
export class EmailApiService {
    constructor(private readonly rabbitMQService: RabbitmqService) {}

    async publishEmail(body: email) {
        await this.rabbitMQService.publish(RK_NOTIFICATION_EMAIL, body);
        return 'sending email....'; 
    }
}
