import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ApiKey extends Document {
    @Prop()
    name: string;

    @Prop()
    apiKey: string;
}
export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
