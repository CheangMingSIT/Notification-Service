import { NotificationLog, QUEUE_EMAIL, QUEUE_SMS } from '@app/common';
import { RabbitmqService } from '@app/common/rabbit-mq';

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class WsService implements OnApplicationBootstrap {
    constructor(
        private readonly rabbitMQService: RabbitmqService,
        private mailerService: MailerService,
        @InjectModel(NotificationLog.name)
        private notificationLogModel: Model<NotificationLog>,
    ) {}

    onApplicationBootstrap() {
        this.rabbitMQService.subscribe(
            QUEUE_EMAIL,
            this.handleEmailMessage.bind(this),
        );
        this.rabbitMQService.subscribe(
            QUEUE_SMS,
            this.handleSMSMessage.bind(this),
        );
    }

    private async updateStatus(uuid: string, status: string) {
        return await this.notificationLogModel.updateOne(
            {
                uuid: uuid,
            },
            {
                $set: { status: status },
            },
        );
    }

    private async handleEmailMessage(emailPayload: any) {
        const payload = {
            from: emailPayload.from,
            to: emailPayload.to,
            subject: emailPayload.subject,
            template: './template',
            context: {
                content: emailPayload.body,
            },
        };
        if (emailPayload.cc) {
            payload['cc'] = emailPayload.cc;
        }
        if (emailPayload.file !== undefined) {
            payload['attachments'] = [
                {
                    filename: emailPayload.file.originalname,
                    content: Buffer.from(emailPayload.file.buffer).toString(
                        'base64',
                    ),
                    encoding: 'base64',
                },
            ];
        }
        try {
            // const response = await this.mailerService.sendMail(payload);
            const response = {
                response: '250 OK',
            }; // Mock response
            if (response.response.includes('250')) {
                this.updateStatus(emailPayload.uuid, 'SUCCESS');
            } else {
                this.updateStatus(emailPayload.uuid, 'FAIL');
            }
        } catch (error) {
            this.updateStatus(emailPayload.uuid, 'FAIL');
            console.error('Error processing email message:', error);
        }
    }

    private async handleSMSMessage(smsPayload: any) {
        try {
            // const response = await fetch(
            //     'https://sms.api.sinch.com/xms/v1/5b121cd7f3544f81b6cb929e842ef141/batches',
            //     {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //             Authorization:
            //                 'Bearer ' + 'c60a2deba7524fd68a9b0ad484d93151',
            //         },
            //         body: JSON.stringify({
            //             from: '447520651359',
            //             to: smsPayload.recipient,
            //             body: smsPayload.body,
            //         }),
            //     },
            // );
            // const data = await response.json();
            const data = {
                cancelled: false,
            }; // Mock response
            if (data.cancelled === false) {
                await this.updateStatus(smsPayload.uuid, 'SUCCESS');
            } else {
                await this.updateStatus(smsPayload.uuid, 'FAIL');
            }
        } catch (error) {
            await this.updateStatus(smsPayload.uuid, 'FAIL');
            console.error('Error processing SMS message:', error);
        }
    }
}
