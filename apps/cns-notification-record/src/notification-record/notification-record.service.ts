import { NotificationLog } from '@app/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecordDto } from './dtos/record.dto';

@Injectable()
export class NotificationRecordService {
    constructor(
        @InjectModel(NotificationLog.name)
        private notificationRecord: Model<NotificationLog>,
    ) {}

    fetchByUserId(userId: string, query: RecordDto) {
        return this.fetchRecords(query, userId);
    }

    fetchByApiKey(secretKey: string, query: RecordDto) {
        return this.fetchRecords(query, undefined, secretKey);
    }

    fetchByAdmin(query: RecordDto) {
        return this.fetchRecords(query);
    }

    private async fetchRecords(
        query: RecordDto,
        userId?: string,
        secretKey?: string,
    ) {
        const { id, startDate, endDate, page, limit } = query;
        let conditions = [];
        if (id) {
            conditions.push({ _id: id });
        }
        if (secretKey) {
            conditions.push({ secretKey });
        }
        if (userId) {
            conditions.push({ userId });
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
            const res = await this.notificationRecord
                .find(
                    conditions.length > 0
                        ? { $and: conditions }
                        : { _id: null },
                )
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();
            const transformedResult = res.map((item) => {
                return {
                    id: item._id,
                    userId: item.userId,
                    secretKey: item.secretKey,
                    channel: item.channel,
                    subject: item.subject,
                    message: Buffer.from(item.message).toString('utf-8'),
                    recipient: item.recipient,
                    sender: item.sender,
                    status: item.status,
                    scheduleDate: item.scheduleDate,
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
