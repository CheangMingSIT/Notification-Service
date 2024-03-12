import { CaslAbilityFactory, Operation } from '@app/auth';
import { NotificationLog, User } from '@app/common';
import { ForbiddenError } from '@casl/ability';
import { AccessibleRecordModel } from '@casl/mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';
import { Repository } from 'typeorm';
import { RecordDto } from './dtos/record.dto';

@Injectable()
export class NotificationRecordService {
    constructor(
        @InjectModel(NotificationLog.name)
        private notificationRecord: AccessibleRecordModel<NotificationLog>,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        @InjectRepository(User, 'postgres')
        private userRepo: Repository<User>,
    ) {}

    async retrieveRecord(user: any, apiKey: string, query: RecordDto) {
        try {
            // Without JWT Token (API Key)
            if (apiKey) {
                const res = await this.notificationRecord
                    .find({
                        secretKey: apiKey,
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
            // With JWT Token
            const { role } = await this.userRepo.findOne({
                where: { userId: user.userId },
                relations: ['role'],
            });
            const { _id, secretKey, startDate, endDate, page, limit } = query;
            const ability =
                await this.caslAbilityFactory.defineAbilitiesFor(user);

            ForbiddenError.from(ability).throwUnlessCan(
                Operation.Read,
                'NotificationLog',
            );
            const condition = [];
            if (_id) {
                condition.push({ _id });
            }
            if (secretKey) {
                condition.push({ secretKey: secretKey });
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
            if (role.hasFullDataControl === false) {
                condition.push({ userId: user.userId });
            }

            const res = await this.notificationRecord
                .accessibleBy(ability)
                .where(
                    condition.length > 0 ? { $and: condition } : { _id: null },
                )
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();

            const transformedResult = res.map((record) => {
                return {
                    id: record._id,
                    userId: record.user.userId,
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
        } catch (e) {
            console.error(e);
            if (error instanceof ForbiddenError) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Error in retrieving record',
            );
        }
    }
}
