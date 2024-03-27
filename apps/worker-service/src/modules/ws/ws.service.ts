import {
    NotificationLog,
    QUEUE_EMAIL,
    QUEUE_SMS,
    RabbitmqService,
} from '@app/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
    Injectable,
    InternalServerErrorException,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Connection, Model } from 'mongoose';
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

function mail(): Promise<MailReponse> {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Sending email...');
            resolve({ response: '250' });
        }, 2000);
    });
} // Mock Mail Reponse

function sms(): Promise<SMSReponse> {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Sending SMS...');
            resolve({ cancelled: false });
        }, 2000);
    });
} // Mock SMS Reponse

@Injectable()
export class WsService implements OnApplicationBootstrap {
    bucket: GridFSBucket;
    constructor(
        private readonly rabbitMQService: RabbitmqService,
        private readonly mailerService: MailerService,
        @InjectModel(NotificationLog.name)
        private notificationLogModel: Model<NotificationLog>,
        @InjectConnection() private connection: Connection,
    ) {
        this.initializeGridFSBucket();
    }

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

    private initializeGridFSBucket() {
        if (!this.connection.readyState) {
            this.connection.once('open', () => {
                console.log('Connected to the database');
                this.bucket = new GridFSBucket(this.connection.db, {
                    bucketName: 'fs',
                });
            });
        } else {
            console.log('Database connection already established');
            this.bucket = new GridFSBucket(this.connection.db, {
                bucketName: 'fs',
            });
        }
    }

    private async updateStatus(userId: string, status: string) {
        return await this.notificationLogModel.updateOne(
            { _id: userId },
            { $set: { status: status } },
        );
    }

    private async handleEmailMessage(emailPayload: any) {
        try {
            const messageWithTemplate = Handlebars.compile(template);
            const message = messageWithTemplate({
                content: emailPayload.body.body,
            });
            const payload = {
                from: emailPayload.body.from,
                to: emailPayload.body.to,
                subject: emailPayload.body.subject,
                html: message,
                attachments: [],
            };
            if (emailPayload.body.cc) {
                payload['cc'] = emailPayload.body.cc;
            }
            if (emailPayload.body.bcc) {
                payload['bcc'] = emailPayload.body.bcc;
            }
            for (const file of emailPayload.fileIds) {
                const fileStream = await this.bucket.openDownloadStream(
                    new ObjectId(file),
                );
                const fileName = await this.bucket.find({
                    _id: new ObjectId(file),
                });
                for await (const doc of fileName) {
                    payload.attachments.push({
                        filename: doc.filename,
                        content: fileStream,
                    });
                }
            }
            const response = await this.mailerService.sendMail(payload);
            // const response = await mail();
            if (response.response.includes('250')) {
                this.updateStatus(emailPayload._id, 'SUCCESS');
            } else {
                this.updateStatus(emailPayload._id, 'FAIL');
            }
        } catch (error) {
            this.updateStatus(emailPayload._id, 'FAIL');
            console.error('Error processing email message:', error);
            throw new InternalServerErrorException(
                'Error processing email message',
            );
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
            const data = await sms();
            if (data.cancelled === false) {
                await this.updateStatus(smsPayload._id, 'SUCCESS');
            } else {
                await this.updateStatus(smsPayload._id, 'FAIL');
            }
        } catch (error) {
            await this.updateStatus(smsPayload._id, 'FAIL');
            console.error('Error processing SMS message:', error);
            throw new InternalServerErrorException(
                'Error processing SMS message',
            );
        }
    }
}
