import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class NotificationLog extends Document{
    @Prop()
    id: string;

    @Prop()
    message_type: string;

    @Prop()
    status: string;

    @Prop()
    message: Buffer;

    @Prop()
    sender: string;

    @Prop() 
    recipient: string;

    @Prop()
    scheduled_date: Date;

    @Prop()
    template_id: number;
}

export const NotificationLogSchema = SchemaFactory.createForClass(NotificationLog);