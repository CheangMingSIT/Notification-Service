import { NotificationLog } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationRecordService {
    constructor(
        @InjectModel(NotificationLog.name)
        private notificationLog: Model<NotificationLog>,
    ) {}
    async fetchNotificationLog(query: {
        recipient: string[];
        sender: string[];
    }) {
        const { recipient, sender } = query;
        const receiver = Array.isArray(recipient) ? recipient : [recipient];
        try {
            const res = await this.notificationLog
                .find({
                    recipient: { $in: receiver },
                })
                .exec();
            const transformedResult = res.map((item) => {
                const channel = item.channel;
                const message = Buffer.from(item.message).toString('utf-8');
                const recipient = item.recipient;
                const sender = item.sender;
                const status = item.status;
                return {
                    channel,
                    message,
                    recipient,
                    sender,
                    status,
                };
            });
            return transformedResult;
        } catch (error) {
            console.error(error);
        }
    }
}
