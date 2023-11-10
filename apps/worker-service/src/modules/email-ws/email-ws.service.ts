import { QUEUE_EMAIL } from '@app/common';
import { RabbitmqService } from '@app/common/rabbit-mq/rabbit-mq.service';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class EmailWsService implements OnModuleInit {
    constructor(private readonly rabbitMQService: RabbitmqService) {}

    async onModuleInit() {
        await this.rabbitMQService.subscribe(
            QUEUE_EMAIL,
            this.handleMessage.bind(this),
        );
    }

    private async handleMessage(emailMessage: any) {
        // Handle the incoming email message
        console.log('Received email message:', emailMessage);

        try {
            // Process the email message, send the email, etc.
            // ...
        } catch (error) {
            // Handle any errors that occur in processing the email message
            console.error('Error processing email message:', error);
        }
    }
}
