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

    @Prop([Object])
    recipient: Object[];

    @Prop()
    scheduleDate: Date;

    @Prop()
    templateId: number;
}

export const NotificationLogSchema =
    SchemaFactory.createForClass(NotificationLog);
