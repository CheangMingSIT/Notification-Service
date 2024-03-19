import { CaslAbilityFactory, Operation } from '@app/auth';
import { ApiKey, User } from '@app/common';
import { ForbiddenError } from '@casl/ability';
import { rulesToAST } from '@casl/ability/extra';
import {
    BadRequestException,
    ForbiddenException,
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
        @InjectRepository(User, 'postgres')
        private userRepo: Repository<User>,
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
    async deleteApiKey(currentUser: any, secretKeyId: string): Promise<string> {
        try {
            const user = await this.userRepo.findOne({
                where: { userId: currentUser.userId },
                relations: ['role'],
            });

            const existingApiKey = await this.apiKeyRepo.findOne({
                where: user.role.hasFullDataControl
                    ? { id: secretKeyId }
                    : { userId: currentUser.userId, id: secretKeyId },
            });
            if (existingApiKey) {
                await this.apiKeyRepo.delete(
                    user.role.hasFullDataControl
                        ? { id: secretKeyId }
                        : { userId: currentUser.userId, id: secretKeyId },
                );
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
    async listApiKeys(currentUser: any, query: SearchTokenDto) {
        try {
            const ability =
                await this.caslAbilityFactory.defineAbilitiesFor(currentUser);
            ForbiddenError.from(ability)
                .setMessage('Cannot Read ApiKey')
                .throwUnlessCan(Operation.Read, ApiKey);
            const checkPolices = rulesToAST(ability, Operation.Read, 'ApiKey');
            const user = await this.userRepo.findOne({
                where: { userId: currentUser.userId },
                relations: ['role'],
            });
            if (user.role.hasFullDataControl === true) {
                const result = await this.apiKeyRepo.find({
                    relations: ['user'],
                    where: user.role.hasFullDataControl
                        ? {
                              name: query.name
                                  ? Like(`${query.name}%`)
                                  : undefined,
                          }
                        : {
                              userId: currentUser.userId,
                              name: query.name
                                  ? Like(`${query.name}%`)
                                  : undefined,
                          },
                });
                const payload = result.map((apiKey) => ({
                    id: apiKey.id,
                    name: apiKey.name,
                    secretKey: apiKey.secretKey,
                    userId: apiKey.userId,
                    organisationId: apiKey.user.organisationId,
                }));
                if (checkPolices['field'] === 'user.organisationId') {
                    return payload.filter(
                        (apikey) =>
                            apikey.organisationId === checkPolices['value'],
                    );
                }
                return payload;
            }
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message);
            }
            throw new InternalServerErrorException(
                "Couldn't fetch api keys. Something went wrong!",
            );
        }
    }
}
