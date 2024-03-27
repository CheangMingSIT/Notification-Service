import { CaslAbilityFactory } from '@app/auth';
import { NotificationLog, User } from '@app/common';
import { ForbiddenError } from '@casl/ability';
import { AccessibleRecordModel } from '@casl/mongoose';
import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordDto } from './dtos/record.dto';

const scheduleDateQuery = {
    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
    $lt: new Date(new Date().setHours(23, 59, 59, 999)),
};
let matchQuery: any = {
    scheduleDate: scheduleDateQuery,
};

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
            let conditions: any[] = [];
            if (apiKey) {
                conditions.push({ secretKey: apiKey });
            } else if (user.role === 'Owner') {
                if (query._id) conditions.push({ _id: query._id });
                if (query.secretKey)
                    conditions.push({ secretKey: query.secretKey });
                if (query.startDate || query.endDate) {
                    const dateCondition: any = {};
                    if (query.startDate)
                        dateCondition['$gte'] = query.startDate;
                    if (query.endDate) dateCondition['$lte'] = query.endDate;
                    conditions.push({ scheduleDate: dateCondition });
                }
            } else {
                const { role, organisationId } = await this.userRepo.findOne({
                    where: { userId: user.userId },
                    relations: ['role'],
                });
                if (query._id) conditions.push({ _id: query._id });
                if (query.secretKey)
                    conditions.push({ secretKey: query.secretKey });
                if (query.startDate || query.endDate) {
                    const dateCondition: any = {};
                    if (query.startDate)
                        dateCondition['$gte'] = query.startDate;
                    if (query.endDate) dateCondition['$lte'] = query.endDate;
                    conditions.push({ scheduleDate: dateCondition });
                }
                if (organisationId)
                    conditions.push({ 'user.organisationId': organisationId });
                if (role.hasFullDataControl === false)
                    conditions.push({ 'user.userId': user.userId });
            }
            const res = await this.notificationRecord
                .where(
                    conditions.length > 0
                        ? { $and: conditions }
                        : { _id: null },
                )
                .sort({ scheduleDate: -1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit)
                .exec();

            return res.map((record) => ({
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
            }));
        } catch (error) {
            throw error instanceof ForbiddenError
                ? new ForbiddenException(error.message)
                : new InternalServerErrorException(error.message);
        }
    }

    async countMessages(user: any, status: any) {
        try {
            if (user.role === 'Owner') {
                matchQuery['status'] = status;
            } else {
                const { organisationId, role, userId } =
                    await this.userRepo.findOne({
                        where: { userId: user.userId },
                        relations: ['role'],
                    });

                matchQuery['status'] = status;
                role.hasFullDataControl === false
                    ? (matchQuery['user.userId'] = userId)
                    : (matchQuery['user.organisationId'] = organisationId);
            }
            const query = await this.notificationRecord
                .where(matchQuery)
                .getQuery();

            const res = await this.notificationRecord
                .aggregate([
                    {
                        $match: {
                            $and: [query],
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                        },
                    },
                ])
                .exec();

            return res.length > 0 ? res[0].count : 0;
        } catch (error) {
            throw error instanceof ForbiddenError
                ? new ForbiddenException(error.message)
                : new InternalServerErrorException(
                      'Error in counting today record',
                  );
        }
    }

    async countTodayRecord(user: any) {
        return await this.countMessages(user, 'SUCCESS');
    }

    async countTodayMessageInQueue(user: any) {
        return await this.countMessages(user, 'QUEUING');
    }

    async countFailedMessage(user: any) {
        return await this.countMessages(user, { $in: ['FAIL', 'QUEUE FAIL'] });
    }

    async countSentTotalMessage(user: any) {
        try {
            const aggregationPipeline: any[] = [];

            if (user.role === 'Owner') {
                aggregationPipeline.push({
                    $group: {
                        _id: {
                            month: { $month: '$scheduleDate' },
                            year: { $year: '$scheduleDate' },
                        },
                        count: { $sum: 1 },
                    },
                });
            } else {
                const { organisationId, role, userId } =
                    await this.userRepo.findOne({
                        where: { userId: user.userId },
                        relations: ['role'],
                    });

                const matchChartQuery = {};
                if (role.hasFullDataControl === false) {
                    matchChartQuery['user.userId'] = userId;
                } else {
                    matchChartQuery['user.organisationId'] = organisationId;
                }

                aggregationPipeline.push(
                    {
                        $match: {
                            $and: [matchChartQuery],
                        },
                    },
                    {
                        $group: {
                            _id: {
                                month: { $month: '$scheduleDate' },
                                year: { $year: '$scheduleDate' },
                            },
                            count: { $sum: 1 },
                        },
                    },
                );
            }

            aggregationPipeline.push(
                {
                    $project: {
                        _id: 0,
                        monthYear: {
                            $dateToString: {
                                format: '%Y-%m',
                                date: {
                                    $dateFromParts: {
                                        year: '$_id.year',
                                        month: '$_id.month',
                                    },
                                },
                            },
                        },
                        count: 1,
                    },
                },
                {
                    $sort: { monthYear: 1 },
                },
                {
                    $limit: 12,
                },
            );

            const res = await this.notificationRecord
                .aggregate(aggregationPipeline)
                .exec();

            return res.map((record) => ({
                monthYear: record.monthYear,
                count: record.count,
            }));
        } catch (error) {
            console.log(error);
            throw error instanceof ForbiddenError
                ? new ForbiddenException(error.message)
                : new InternalServerErrorException(
                      'Error in counting total sent message',
                  );
        }
    }

    async countTotalUndeliveredMessage(user: any) {
        try {
            const aggregationPipeline: any[] = [];

            if (user.role === 'Owner') {
                aggregationPipeline.push({
                    $match: {
                        status: { $in: ['FAIL', 'QUEUE FAIL'] },
                    },
                });
            } else {
                const { organisationId, role, userId } =
                    await this.userRepo.findOne({
                        where: { userId: user.userId },
                        relations: ['role'],
                    });

                const matchChartQuery = {};
                if (role.hasFullDataControl === false) {
                    matchChartQuery['user.userId'] = userId;
                } else {
                    matchChartQuery['user.organisationId'] = organisationId;
                }

                aggregationPipeline.push({
                    $match: {
                        $and: [
                            {
                                status: { $in: ['FAIL', 'QUEUE FAIL'] },
                            },
                            matchChartQuery,
                        ],
                    },
                });
            }

            aggregationPipeline.push(
                {
                    $group: {
                        _id: {
                            month: { $month: '$scheduleDate' },
                            year: { $year: '$scheduleDate' },
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        monthYear: {
                            $dateToString: {
                                format: '%Y-%m',
                                date: {
                                    $dateFromParts: {
                                        year: '$_id.year',
                                        month: '$_id.month',
                                    },
                                },
                            },
                        },
                        count: 1,
                    },
                },
                {
                    $sort: { monthYear: 1 },
                },
                {
                    $limit: 12,
                },
            );

            const res = await this.notificationRecord
                .aggregate(aggregationPipeline)
                .exec();

            return res.map((record) => ({
                monthYear: record.monthYear,
                count: record.count,
            }));
        } catch (error) {
            throw error instanceof ForbiddenError
                ? new ForbiddenException(error.message)
                : new InternalServerErrorException(
                      'Error in counting total undelivered message',
                  );
        }
    }
}
