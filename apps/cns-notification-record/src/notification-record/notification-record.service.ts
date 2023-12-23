import { NotificationLog } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogDto } from './dtos/log.dto';

@Injectable()
export class NotificationRecordService {
    constructor(
        @InjectModel(NotificationLog.name)
        private notificationLog: Model<NotificationLog>,
    ) {}
    async fetchNotificationLog(query: LogDto) {
        const { recipient, sender, page, limit } = query;
        const receiver = Array.isArray(recipient) ? recipient : [recipient];
        try {
            const res = await this.notificationLog
                .find({
                    recipient: { $in: receiver },
                })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();
            const transformedResult = res.map((item) => {
                return {
                    channel: item.channel,
                    message: Buffer.from(item.message).toString('utf-8'),
                    recipient: item.recipient,
                    sender: item.sender,
                    status: item.status,
                };
            });
            return transformedResult;
        } catch (error) {
            throw new Error(error);
        }
    }
}
