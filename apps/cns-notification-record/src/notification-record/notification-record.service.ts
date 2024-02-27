import { CaslAbilityFactory } from '@app/auth';
import { NotificationLog, User } from '@app/common';
import { AccessibleRecordModel } from '@casl/mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationRecordService {
    constructor(
        @InjectModel(NotificationLog.name)
        private notificationRecord: AccessibleRecordModel<NotificationLog>,
        @InjectRepository(User, 'postgres')
        private userRepository: Repository<User>,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) {}

    async retrieveRecord(user: any, secretKey: any, query: any) {
        if (secretKey) {
            const res = await this.notificationRecord
                .find({
                    secretKey,
                })
                .sort({ scheduleDate: -1 })
                .exec();
            return res.map((record) => {
                return {
                    id: record._id,
                    channel: record.channel,
                    status: record.status,
                    scheduleDate: record.scheduleDate,
                };
            });
        }
        const { id, ApiKey, startDate, endDate, page, limit } = query;
        const ability = await this.caslAbilityFactory.defineAbilitiesFor(user);
        const condition = [];
        if (id) {
            condition.push({ id });
        }
        if (ApiKey) {
            condition.push({ ApiKey });
        }
        if (startDate || endDate) {
            let dateCondition = {};
            if (startDate) {
                dateCondition['$gte'] = startDate;
            }
            if (endDate) {
                dateCondition['$lte'] = endDate;
            }
            condition.push({ scheduleDate: dateCondition });
        }
        const res = await this.notificationRecord
            .accessibleBy(ability)
            .where(condition.length ? { $and: condition } : { _id: null })
            .skip(page)
            .limit(limit);

        const transformedResult = res.map((record) => {
            return {
                id: record._id,
                userId: record.userId,
                secretKey: record.secretKey,
                channel: record.channel,
                subject: record.subject,
                message: Buffer.from(record.message).toString('utf8'),
                recipient: record.recipient,
                sender: record.sender,
                status: record.status,
                scheduleDate: record.scheduleDate,
            };
        });

        return transformedResult;
    }
}
