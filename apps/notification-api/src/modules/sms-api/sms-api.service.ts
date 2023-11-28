import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { NotificationLog, RK_NOTIFICATION_SMS } from '@app/common';
import { smsInputDto } from './dtos/sms.dto';
import { RabbitmqService } from '@app/common/rabbit-mq/rabbit-mq.service';

interface smsLog {
    uuid: string;
    channel: string;
    status: string;
    message: string;
    sender: string;
    recipient: string[];
    scheduleDate: Date;
    templateId: number;
}

@Injectable()
export class SmsApiService {
    constructor(
        private readonly rabbitMQService: RabbitmqService,
        @InjectModel(NotificationLog.name)
        private notificationLogModel: Model<NotificationLog>,
    ) {}
    async publishSMS(body: smsInputDto) {
        let uuid = uuidv4();
        const payload = { uuid, ...body };
        try {
            const response = await this.rabbitMQService.publish(
                RK_NOTIFICATION_SMS,
                payload,
            );
            const log: smsLog = {
                uuid: uuid,
                channel: 'SMS',
                status: response === true ? 'QUEUING' : 'FAIL TO ENTER QUEUE',
                message: body.body,
                sender: body.sender,
                recipient: [...body.recipient],
                scheduleDate: new Date(),
                templateId: body.template,
            };
            const notificationLog = new this.notificationLogModel(log);
            await notificationLog.save();

            if (response === false) {
                return {
                    response: 'fail',
                    message: 'SMS failed to add to the queue',
                };
            }

            return {
                response: 'true',
                message: 'SMS added to the queue successfully',
            };
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}
