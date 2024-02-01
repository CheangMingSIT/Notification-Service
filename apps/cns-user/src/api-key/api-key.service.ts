import { ApiKey, PaginationDto } from '@app/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';

interface ApiKeyRecord {
    readonly name: string;
    readonly secretKey: string;
    readonly userId: string;
}
@Injectable()
export class ApiKeyService {
    constructor(
        @InjectRepository(ApiKey, 'postgres')
        private apiKeyRepo: Repository<ApiKey>,
    ) {}

    async generateApiKey(name: string, user_uuid: string): Promise<Object> {
        const apiKey = randomBytes(32).toString('hex');
        const record: ApiKeyRecord = {
            name: name,
            secretKey: apiKey,
            userId: user_uuid,
        };
        try {
            const newApiKey = this.apiKeyRepo.create(record);
            await this.apiKeyRepo.save(newApiKey);
            return apiKey;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException("Couldn't generate api key");
        }
    }

    async listApiKeys(
        user_uuid: string,
        pagination: PaginationDto,
    ): Promise<Object> {
        const { page, limit } = pagination;
        try {
            const response = await this.apiKeyRepo.find({
                where: { userId: user_uuid },
                skip: (page - 1) * limit,
                take: limit,
            });
            return response.map((record) => {
                return {
                    name: record.name,
                    apiKey: record.secretKey,
                };
            });
        } catch (error) {
            throw new InternalServerErrorException("Couldn't fetch api keys");
        }
    }
}
