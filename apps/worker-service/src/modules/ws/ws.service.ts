import {
    NotificationLog,
    QUEUE_EMAIL,
    QUEUE_SMS,
    RabbitmqService,
} from '@app/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import { Model } from 'mongoose';
import { join } from 'path';

interface MailReponse {
    response: string;
} // Mock Response

interface SMSReponse {
    cancelled: boolean;
} // Mock Response

const template = fs.readFileSync(
    join(__dirname + '/template/template.hbs'),
    'utf8',
);
@Injectable()
export class WsService implements OnApplicationBootstrap {
    constructor(
        private readonly rabbitMQService: RabbitmqService,
        private readonly mailerService: MailerService,
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

    private async updateStatus(userId: string, status: string) {
        return await this.notificationLogModel.updateOne(
            {
                _id: userId,
            },
            {
                $set: { status: status },
            },
        );
    }

    private async handleEmailMessage(emailPayload: any) {
        const messageWithTemplate = Handlebars.compile(template);
        const message = messageWithTemplate({ content: emailPayload.body });
        const payload = {
            from: emailPayload.from,
            to: emailPayload.to,
            subject: emailPayload.subject,
            html: message,
        };
        if (emailPayload.cc) {
            payload['cc'] = emailPayload.cc;
        }
        if (emailPayload.bcc) {
            payload['bcc'] = emailPayload.bcc;
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

        function mail(): Promise<MailReponse> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('Sending email...');
                    resolve({ response: '250' });
                }, 2000);
            });
        } // Mock Mail Reponse
        try {
            // const response = await this.mailerService.sendMail(payload);
            const response = await mail();
            if (response.response.includes('250')) {
                this.updateStatus(emailPayload._id, 'SUCCESS');
            } else {
                this.updateStatus(emailPayload._id, 'FAIL');
            }
        } catch (error) {
            this.updateStatus(emailPayload._id, 'FAIL');
            console.error('Error processing email message:', error);
        }
    }

    private async handleSMSMessage(smsPayload: any) {
        function mail(): Promise<SMSReponse> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('Sending SMS...');
                    resolve({ cancelled: false });
                }, 2000);
            });
        } // Mock SMS Reponse

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
            const data = await mail();
            if (data.cancelled === false) {
                await this.updateStatus(smsPayload._id, 'SUCCESS');
            } else {
                await this.updateStatus(smsPayload._id, 'FAIL');
            }
        } catch (error) {
            await this.updateStatus(smsPayload._id, 'FAIL');
            console.error('Error processing SMS message:', error);
        }
    }
}
