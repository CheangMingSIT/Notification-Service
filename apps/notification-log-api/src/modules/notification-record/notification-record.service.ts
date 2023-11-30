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
    fetchNotificationLog(query: { recipient: string; sender: string }) {
        const { recipient, sender } = query;
        return this.notificationLog
            .find({
                recipient: {
                    $elemMatch: {
                        to: { $in: recipient },
                    },
                },
            })
            .exec()
            .then(
                (res) => {
                    return res;
                },
                (error) => {
                    console.error(error);
                },
            );
    }
}
