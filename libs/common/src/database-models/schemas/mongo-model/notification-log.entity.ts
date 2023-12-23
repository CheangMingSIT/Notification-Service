import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class NotificationLog extends Document {
    @Prop({ type: String })
    uuid: string;

    @Prop()
    channel: string;

    @Prop()
    status: string;

    @Prop({ type: Buffer })
    message: Buffer;

    @Prop()
    sender: string;

    @Prop([String])
    recipient: string[];

    @Prop()
    scheduleDate: Date;
}

export const NotificationLogSchema =
    SchemaFactory.createForClass(NotificationLog);
