import { Injectable } from '@nestjs/common';
import { RabbitmqService } from '@app/common/rabbit-mq/rabbit-mq.service';
import { RK_NOTIFICATION_EMAIL } from '@app/common';

@Injectable()
export class EmailApiService {
    constructor(private readonly rabbitMQService: RabbitmqService) {}

    async publishEmail(body: {
        id: number;
        date: Date;
        from: string;
        to: string;
        cc: string;
        bcc: string;
        subject: string;
        body: string;
        template: number;
    }) {
        await this.rabbitMQService.publish(RK_NOTIFICATION_EMAIL, body);
        return 'sending email....';
    }
}
