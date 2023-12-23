import { ApiKey } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';

interface ApiKeyRecord {
    readonly name: string;
    readonly apiKey: string;
}
@Injectable()
export class ApiKeyService {
    constructor(
        @InjectModel(ApiKey.name) private apiKeyRecord: Model<ApiKey>,
    ) {}

    async generateApiKey(name: string): Promise<string> {
        const apiKey = randomBytes(32).toString('hex');
        const record: ApiKeyRecord = {
            name: name,
            apiKey: apiKey,
        };
        try {
            const newApiKey = new this.apiKeyRecord(record);
            await newApiKey.save();
        } catch (error) {
            throw new error(error);
        }
        return apiKey;
    }

    async listApiKeys(): Promise<ApiKey[]> {
        try {
            const response = await this.apiKeyRecord.find();
            return response;
        } catch (error) {
            throw error;
        }
    }
}
