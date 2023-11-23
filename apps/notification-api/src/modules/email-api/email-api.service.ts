import { Injectable } from '@nestjs/common';
import { RabbitmqService } from '@app/common/rabbit-mq/rabbit-mq.service';
import { NotificationLog, RK_NOTIFICATION_EMAIL } from '@app/common';
import { emailInputDto } from './dtos/email-api.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EmailApiService {
    constructor(
        private readonly rabbitMQService: RabbitmqService,
        @InjectModel(NotificationLog.name)
        private notificationLogModel: Model<NotificationLog>,
    ) {}

    async publishEmail(body: emailInputDto) {
        const response = await this.rabbitMQService.publish(
            RK_NOTIFICATION_EMAIL,
            body,
        );
        const timestamp = new Date();
        const payload = {
            message_type: 'email',
            status: response === true ? 'pending' : 'failed',
            message: body.body,
            sender: body.from,
            recipient: body.cc ? [body.to, body.cc].join(',') : body.to,
            scheduled_date: timestamp,
            template_id: body.template,
        };
        const notificationLog = new this.notificationLogModel(payload);
        await notificationLog.save();
        if (response === false) {
            return {
                response: 'fail',
                message: 'failed to add email to the queue',
            };
        }
        return {
            response: 'true',
            message: 'Email added to the queue successfully',
        };
    }
}
