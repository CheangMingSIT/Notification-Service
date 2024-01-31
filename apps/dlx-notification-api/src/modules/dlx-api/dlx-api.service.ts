import {
    DLQ_EMAIL,
    DLQ_SMS,
    NotificationLog,
    RabbitmqService,
} from '@app/common';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DlxApiService implements OnApplicationBootstrap {
    constructor(
        private readonly rabbitMQService: RabbitmqService,
        @InjectModel(NotificationLog.name)
        private notificationLogModel: Model<NotificationLog>,
    ) {}

    onApplicationBootstrap() {
        this.rabbitMQService.subscribe(
            DLQ_EMAIL,
            this.handleDLQEmailMessage.bind(this),
        );
        this.rabbitMQService.subscribe(
            DLQ_SMS,
            this.handleDLQSMSMessage.bind(this),
        );
    }

    private async updateStatus(uuid: string, status: string) {
        return await this.notificationLogModel.updateOne(
            {
                _id: uuid,
            },
            {
                $set: { status: status },
            },
        );
    }
    private async handleDLQEmailMessage(emailPayload: any) {
        try {
            await this.updateStatus(emailPayload._id, 'QUEUE FAIL');
        } catch (error) {
            console.error(error);
        }
    }
    private async handleDLQSMSMessage(smsPayload: any) {
        try {
            await this.updateStatus(smsPayload._id, 'QUEUE FAIL');
        } catch (error) {
            console.error(error);
        }
    }
}
