import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiKey } from '../../../../../libs/common/src/database';
import { randomBytes } from 'crypto';

interface ApiKeyRecord {
    readonly name: string;
    readonly apiKey: string;
}
@Injectable()
export class ApiAuthService {
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

    async validateApiKey(apikey: string): Promise<boolean> {
        const apiKeyRecord = await this.apiKeyRecord.findOne({
            apiKey: apikey,
        });
        if (!apiKeyRecord) {
            throw new UnauthorizedException();
        }
        return true;
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
