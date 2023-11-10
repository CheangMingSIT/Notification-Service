import { QUEUE_SMS } from '@app/common';
import { RabbitmqService } from '@app/common/rabbit-mq/rabbit-mq.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsWsService {
    constructor(private readonly rabbitMQService: RabbitmqService) {}

    async onModuleInit() {
        await this.rabbitMQService.subscribe(
            QUEUE_SMS,
            this.handleMessage.bind(this),
        );
    }

    private async handleMessage(smsMessage: any) {
        // Handle the incoming email message
        console.log('Received SMS message:', smsMessage);

        try {
            // Process the email message, send the email, etc.
            // ...
        } catch (error) {
            // Handle any errors that occur in processing the email message
            console.error('Error processing SMS message:', error);
        }
    }
}
