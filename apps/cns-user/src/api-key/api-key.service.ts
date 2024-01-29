import { ApiKeys } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';

interface ApiKeyRecord {
    readonly name: string;
    readonly apiKey: string;
}
@Injectable()
export class ApiKeyService {
    constructor(
        @InjectRepository(ApiKeys, 'postgres')
        private apiKeyRepo: Repository<ApiKeys>,
    ) {}

    async generateApiKey(name: string): Promise<Object> {
        const apiKey = randomBytes(32).toString('hex');
        const record: ApiKeyRecord = {
            name: name,
            apiKey: apiKey,
        };
        try {
            const newApiKey = this.apiKeyRepo.create(record);
            await this.apiKeyRepo.save(newApiKey);
            return { Token: apiKey };
        } catch (error) {
            throw new error(error);
        }
    }

    async listApiKeys(): Promise<ApiKeyRecord[]> {
        try {
            const response = await this.apiKeyRepo.find();
            return response.map((record) => {
                return {
                    name: record.name,
                    apiKey: record.apiKey,
                };
            });
        } catch (error) {
            throw error;
        }
    }
}
