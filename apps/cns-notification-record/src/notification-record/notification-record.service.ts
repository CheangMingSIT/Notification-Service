import { NotificationLog } from '@app/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecordDto } from './dtos/record.dto';

@Injectable()
export class NotificationRecordService {
    constructor(
        @InjectModel(NotificationLog.name)
        private notificationLog: Model<NotificationLog>,
    ) {}
    async fetchNotificationLog(query: RecordDto) {
        const { apikey, userId, startDate, endDate, page, limit } = query;
        let conditions = [];
        if (apikey) {
            conditions.push({ apikey: apikey });
        }
        if (userId) {
            conditions.push({ userId: userId });
        }
        if (startDate || endDate) {
            let dateCondition = {};
            if (startDate) {
                dateCondition['$gte'] = startDate;
            }
            if (endDate) {
                dateCondition['$lte'] = endDate;
            }
            conditions.push({ scheduleDate: dateCondition });
        }
        try {
            const res = await this.notificationLog
                .find(
                    conditions.length > 0 ? { $or: conditions } : { _id: null },
                )
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();
            const transformedResult = res.map((item) => {
                return {
                    channel: item.channel,
                    subject: item.subject,
                    message: Buffer.from(item.message).toString('utf-8'),
                    recipient: item.recipient,
                    sender: item.sender,
                    status: item.status,
                };
            });
            return transformedResult;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                "Couldn't fetch notification log",
            );
        }
    }
}
