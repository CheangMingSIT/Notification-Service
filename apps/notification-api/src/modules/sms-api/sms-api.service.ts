import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { NotificationLog, RK_NOTIFICATION_SMS } from '@app/common';
import { smsInputDto } from './dtos/sms.dto';
import { RabbitmqService } from '@app/common/rabbit-mq/rabbit-mq.service';

@Injectable()
export class SmsApiService {
    constructor(
        private readonly rabbitMQService: RabbitmqService,
        @InjectModel(NotificationLog.name)
        private notificationLogModel: Model<NotificationLog>,
    ) {}
    async publishSMS(body: smsInputDto) {
        const response = await this.rabbitMQService.publish(RK_NOTIFICATION_SMS, body);
        console.log(response)
        const timestamp = new Date();
        const payload = {
            message_type: 'sms',
            status: 'pending',
            message: body.body,
            sender: body.sender,
            recipient: body.recipient,
            scheduled_date: timestamp,
            template_id: body.template,
        };
        const notificationLog = new this.notificationLogModel(payload);
        await notificationLog.save();
        if (response === false) {
            return {
                response: 'fail',
                message: 'failed to add SMS to the queue',
            };
        }
        return {
            response: 'true',
            message: 'SMS added to the queue successfully',
        };
    }
}
