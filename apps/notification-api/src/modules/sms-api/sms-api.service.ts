import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import {
    NotificationLog,
    RK_NOTIFICATION_SMS,
    RabbitmqService,
} from '@app/common';
import { SmsInputDto } from './dtos/sms.dto';

interface smsLog {
    _id: string;
    readonly channel: string;
    readonly status: string;
    readonly message: string;
    readonly sender: string;
    readonly recipient: string[];
    readonly scheduleDate: Date;
    readonly apiKey: string;
}

@Injectable()
export class SmsApiService {
    constructor(
        private readonly rabbitMQService: RabbitmqService,
        @InjectModel(NotificationLog.name)
        private notificationLogModel: Model<NotificationLog>,
    ) {}
    async publishSMS(body: SmsInputDto, apiKey: string) {
        let _id = uuidv4();
        const payload = { _id, ...body };
        try {
            const response = await this.rabbitMQService.publish(
                RK_NOTIFICATION_SMS,
                payload,
            );
            const log: smsLog = {
                _id,
                channel: 'SMS',
                status: response === true ? 'QUEUING' : 'FAIL TO ENTER QUEUE',
                message: body.body,
                sender: body.sender,
                recipient: body.recipient,
                scheduleDate: new Date(),
                apiKey,
            };
            const notificationLog = new this.notificationLogModel(log);
            await notificationLog.save();

            if (response === false) {
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'SMS failed to add to the queue',
                };
            }
            return {
                status: HttpStatus.CREATED,
                message: 'SMS added to the queue successfully',
            };
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
}
