import { ApiKey } from '@app/common';
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Like, Repository } from 'typeorm';
import { SearchTokenDto } from './dtos/search-token.dto';

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

    async generateApiKey(name: string, userId: string): Promise<Object> {
        const secretKey = randomBytes(32).toString('hex');
        const record: ApiKeyRecord = {
            name: name,
            secretKey,
            userId,
        };
        try {
            const newSecretKey = this.apiKeyRepo.create(record);
            await this.apiKeyRepo.save(newSecretKey);
            return secretKey;
        } catch (error) {
            console.error('Error occurred while generating API key:', error);
            throw new InternalServerErrorException(
                "Couldn't generate api key. Something went wrong!",
            );
        }
    }

    async listApiKeys(userId: string, query: SearchTokenDto): Promise<Object> {
        const { name } = query;
        try {
            const response = await this.apiKeyRepo.find({
                where: { userId, name: name ? Like(`${name}%`) : undefined },
            });
            return response.map((record) => {
                return {
                    id: record.id,
                    name: record.name,
                    secretKey: record.secretKey,
                };
            });
        } catch (error) {
            console.error('Error occurred while fetching API keys:', error);
            throw new BadRequestException(
                "Couldn't fetch api keys. Something went wrong!",
            );
        }
    }

    async deleteApiKey(userId: string, secretKeyId: string): Promise<string> {
        try {
            const existingApiKey = await this.apiKeyRepo.findOne({
                where: { userId, id: secretKeyId },
            });
            if (existingApiKey) {
                await this.apiKeyRepo.delete({
                    userId,
                    id: secretKeyId,
                });
                return 'API Key deleted successfully';
            } else {
                throw new BadRequestException('Invalid secret key');
            }
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                console.error('Error occurred while deleting API key:', error);
                throw new InternalServerErrorException(
                    'Couldn’t delete api key. Something went wrong!',
                );
            }
        }
    }
}
