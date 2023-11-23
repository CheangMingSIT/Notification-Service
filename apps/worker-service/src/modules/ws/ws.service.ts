import { QUEUE_EMAIL, QUEUE_SMS } from '@app/common';
import { RabbitmqService } from '@app/common/rabbit-mq/rabbit-mq.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer'
import e from 'express';

@Injectable()
export class WsService implements OnModuleInit {
    constructor(private readonly rabbitMQService: RabbitmqService, private mailerService: MailerService) { }

    async onModuleInit() {

        await this.rabbitMQService.subscribe(
            QUEUE_EMAIL,
            this.handleEmailMessage.bind(this),
        );

        await this.rabbitMQService.subscribe(
            QUEUE_SMS,
            this.handleSMSMessage.bind(this),
        );
    }

    private async handleEmailMessage(emailMessage: any) {
        const message = {
            from: emailMessage.from,
            to: emailMessage.to,
            subject: emailMessage.subject,
            text: emailMessage.body,
        }

        if (emailMessage.cc) {
            message["cc"] = emailMessage.cc
        }
        try {
            const response = await this.mailerService.sendMail(message)
            console.log(response);
        } catch (error) {
            // Handle any errors that occur in processing the email message
            console.error('Error processing email message:', error);
        }
    }

    private async handleSMSMessage(smsMessage: any) {
        try {
            const response = await fetch("https://sms.api.sinch.com/xms/v1/5b121cd7f3544f81b6cb929e842ef141/batches", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + 'c60a2deba7524fd68a9b0ad484d93151'
                },
                body: JSON.stringify({
                    from: "447520651359",
                    to: ["6592208810"],
                    body: smsMessage.body
                })
            })
            const data = await response.json()
            console.log(data);
        } catch (error) {
            // Handle any errors that occur in processing the SMS message
            console.error('Error processing SMS message:', error);
        }
    }
}

