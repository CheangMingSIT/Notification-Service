import { Status } from '@app/common/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class NotificationLog extends Document {
    constructor(
        _id: string,
        channel: string,
        status: string,
        subject: string,
        message: Buffer,
        sender: string,
        recipient: string[],
        scheduleDate: Date,
        secretKey: string,
        user: object,
        fileIds: string,
    ) {
        super();
        this._id = _id;
        this.channel = channel;
        this.status = status as Status;
        this.subject = subject;
        this.message = message;
        this.sender = sender;
        this.recipient = recipient;
        this.scheduleDate = scheduleDate;
        this.secretKey = secretKey;
        this.user = {
            userId: this.user.userId,
            organisationId: this.user.organisationId,
        };
        this.fileIds = fileIds;
    }
    static readonly modelName = 'NotificationLog';
    @Prop()
    _id: string;

    @Prop()
    channel: string;

    @Prop({ enum: Status })
    status: string;

    @Prop()
    subject: string;

    @Prop({ type: Buffer })
    message: Buffer;

    @Prop()
    sender: string;

    @Prop([String])
    recipient: string[];

    @Prop()
    scheduleDate: Date;

    @Prop()
    secretKey: string;

    @Prop({ type: Object })
    user: {
        userId: string;
        organisationId: string;
    };

    @Prop([String])
    fileIds: string;
}

export const NotificationLogSchema =
    SchemaFactory.createForClass(NotificationLog);
