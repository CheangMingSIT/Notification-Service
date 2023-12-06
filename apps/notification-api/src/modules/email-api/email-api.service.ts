import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    RabbitmqService,
    NotificationLog,
    RK_NOTIFICATION_EMAIL,
} from '@app/common';
import { emailInputDto } from './dtos/email-api.dto';

interface EmailLog {
    readonly uuid: string;
    readonly channel: string;
    readonly status: string;
    message: string;
    sender: string;
    recipient: string[];
    scheduleDate: Date;
}

@Injectable()
export class EmailApiService {
    constructor(
        private readonly rabbitMQService: RabbitmqService,
        @InjectModel(NotificationLog.name)
        private notificationLogModel: Model<NotificationLog>,
    ) {}

    async publishEmail(body: emailInputDto, file: any) {
        let uuid = uuidv4();
        const payload = { uuid, ...body, file };
        try {
            const response = await this.rabbitMQService.publish(
                RK_NOTIFICATION_EMAIL,
                payload,
            );
            const log: EmailLog = {
                uuid: uuid,
                channel: 'Email',
                status: response === true ? 'QUEUING' : 'FAIL TO ENTER QUEUE',
                message: body.body,
                sender: body.from,
                recipient: body.cc ? [...body.to, ...body.cc] : [...body.to],
                scheduleDate: new Date(),
            };

            const notificationLog = new this.notificationLogModel(log);
            await notificationLog.save();
            if (response === false) {
                return {
                    response: 'fail',
                    message: 'Email failed to add to the queue',
                };
            }
            return {
                response: 'true',
                message: 'Email added to the queue successfully',
            };
        } catch (error) {
            throw new Error(error);
        }
    }
}
