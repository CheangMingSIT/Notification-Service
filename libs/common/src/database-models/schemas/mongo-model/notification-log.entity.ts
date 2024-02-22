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
        userId: string,
        fileIds: string,
    ) {
        super();
        this._id = _id;
        this.channel = channel;
        this.status = status;
        this.subject = subject;
        this.message = message;
        this.sender = sender;
        this.recipient = recipient;
        this.scheduleDate = scheduleDate;
        this.secretKey = secretKey;
        this.userId = userId;
        this.fileIds = fileIds;
    }
    static readonly modelName = 'NotificationLog';
    @Prop()
    _id: string;

    @Prop()
    channel: string;

    @Prop()
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

    @Prop()
    userId: string;

    @Prop([String])
    fileIds: string;
}

export const NotificationLogSchema =
    SchemaFactory.createForClass(NotificationLog);
