import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import {
    ApiKey,
    NotificationLog,
    RK_NOTIFICATION_EMAIL,
    RabbitmqService,
} from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailInputDto } from './dtos/email-api.dto';

interface EmailLog {
    readonly _id: string;
    readonly channel: string;
    readonly status: string;
    readonly subject: string;
    readonly message: string;
    readonly sender: string;
    readonly recipient: string[];
    readonly scheduleDate: Date;
    readonly secretKey: string;
    readonly userId: string;
}
@Injectable()
export class EmailApiService {
    constructor(
        private readonly rabbitMQService: RabbitmqService,
        @InjectModel(NotificationLog.name)
        private notificationLogModel: Model<NotificationLog>,
        @InjectRepository(ApiKey, 'postgres')
        private apiKeyRepo: Repository<ApiKey>,
    ) {}

    async publishEmail(body: EmailInputDto, file: any, secretKey: string) {
        const _id = uuidv4();
        let mergeRecipients = [];
        let response: Boolean;
        const payload = { _id, ...body, file, secretKey };
        try {
            response = await this.rabbitMQService.publish(
                RK_NOTIFICATION_EMAIL,
                payload,
            );
            if (!response) {
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Email failed to add to the queue',
                };
            }
            const { userId } = await this.apiKeyRepo.findOneBy({ secretKey });
            if (body.cc) {
                mergeRecipients = [...body.to, ...body.cc];
            } else if (body.bcc) {
                mergeRecipients = [...body.to, ...body.bcc];
            } else if (body.cc && body.bcc) {
                mergeRecipients = [...body.to, ...body.cc, ...body.bcc];
            } else {
                mergeRecipients = [...body.to];
            }

            const log: EmailLog = {
                _id,
                channel: 'Email',
                status: response === true ? 'QUEUING' : 'QUEUE FAILED',
                subject: body.subject,
                message: body.body,
                sender: body.from,
                recipient: mergeRecipients,
                scheduleDate: new Date(),
                secretKey,
                userId,
            };

            const logModel = new this.notificationLogModel(log);
            await logModel.save();
            return {
                status: HttpStatus.CREATED,
                message: 'Email added to the queue successfully',
            };
        } catch (error) {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong',
            };
        }
    }
}
