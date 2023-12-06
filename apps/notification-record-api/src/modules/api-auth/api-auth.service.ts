import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import generateApiKey from 'generate-api-key';
import { ApiKey } from '../../../../../libs/common/src/database';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { secret } from '@app/common';

interface ApiKeyRecord {
    readonly name: string;
    readonly apiKey: string;
}
const iv = randomBytes(16);

@Injectable()
export class ApiAuthService {
    constructor(
        @InjectModel(ApiKey.name) private apiKeyRecord: Model<ApiKey>,
    ) {}
    async generateApiKey(name: string) {
        const apiKey = generateApiKey({
            method: 'string',
            length: 20,
        });
        const stringApiKey = apiKey.toString();

        const key = (await promisify(scrypt)(secret, 'salt', 32)) as Buffer;
        const cipher = createCipheriv('aes-256-ctr', key, iv);
        const encryptedApiKey = Buffer.concat([
            cipher.update(stringApiKey),
            cipher.final(),
        ]);
        const record: ApiKeyRecord = {
            name: name,
            apiKey: encryptedApiKey.toString(),
        };
        try {
            const newApiKey = new this.apiKeyRecord(record);
            await newApiKey.save();
        } catch (error) {
            throw new Error(error);
        }
        return apiKey;
    }

    async validateApiKey(apikey: string): Promise<Boolean> {
        const key = (await promisify(scrypt)(secret, 'salt', 32)) as Buffer;
        const cipher = createCipheriv('aes-256-ctr', key, iv);
        const encryptedApiKey = Buffer.concat([
            cipher.update(apikey),
            cipher.final(),
        ]);
        const result = await this.apiKeyRecord
            .findOne({ apiKey: encryptedApiKey.toString() })
            .exec();
        if (result) {
            return true;
        } else {
            throw new UnauthorizedException('Invalid API Key');
        }
    }
}
