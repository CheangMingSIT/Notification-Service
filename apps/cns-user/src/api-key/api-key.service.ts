import { Actions, CaslAbilityFactory } from '@app/auth';
import { ApiKey } from '@app/common';
import { rulesToAST } from '@casl/ability/extra';
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
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
        private readonly caslAbilityFactory: CaslAbilityFactory,
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
    async listApiKeys(user: any, query: SearchTokenDto) {
        try {
            const ability =
                await this.caslAbilityFactory.defineAbilitiesFor(user);
            const condition = rulesToAST(ability, Actions.Read, 'ApiKey');
            if (ability.can(Actions.Read, 'ApiKey')) {
                if (condition['field'] === 'userId') {
                    const result = await this.apiKeyRepo.find({
                        where: {
                            userId: condition.value
                                ? condition.value.toString()
                                : undefined,
                            name: query.name
                                ? Like(`${query.name}%`)
                                : undefined,
                        },
                    });
                    return result;
                } else {
                    return await this.apiKeyRepo.find({
                        where: {
                            name: query.name
                                ? Like(`${query.name}%`)
                                : undefined,
                        },
                    });
                }
            } else if (ability.cannot(Actions.Read, 'ApiKey')) {
                throw new UnauthorizedException(
                    "You don't have access to read",
                );
            }
        } catch (error) {
            console.error('Error occurred while fetching API keys:', error);
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException(
                "Couldn't fetch api keys. Something went wrong!",
            );
        }
    }
}
