import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class NotificationLog extends Document {
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
    apikey: string;
}

export const NotificationLogSchema =
    SchemaFactory.createForClass(NotificationLog);
