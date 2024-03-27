import { CaslAbilityFactory } from '@app/auth';
import { ApiKey, User } from '@app/common';
import { ForbiddenError } from '@casl/ability';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
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
    async listApiKeys(
        currentUser: any,
        query: SearchTokenDto,
    ): Promise<Object> {
        try {
            const user = await this.userRepo.findOne({
                where: { userId: currentUser.userId },
                relations: ['role'],
            });
            const result = await this.apiKeyRepo.find({
                select: {
                    id: true,
                    name: true,
                    secretKey: true,
                    isDisabled: true,
                    userId: true,
                    user: {
                        organisationId: true,
                    },
                },
                relations: ['user'],
                where: user.role.hasFullDataControl
                    ? {
                          name: query.name ? Like(`${query.name}%`) : undefined,
                          user: {
                              organisationId: user.organisationId,
                          },
                      }
                    : {
                          userId: user.userId,
                          name: query.name ? Like(`${query.name}%`) : undefined,
                          user: {
                              organisationId: user.organisationId,
                          },
                      },
            });
            return result.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    secretKey: item.secretKey,
                    userId: item.userId,
                    isDisabled: item.isDisabled,
                    organisationId: item.user.organisationId,
                };
            });
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message);
            }
            console.error('Error occurred while fetching API keys:', error);
            throw new InternalServerErrorException(
                "Couldn't fetch api keys. Something went wrong!",
            );
        }
    }
    async disableApiKey(
        currentUser: any,
        secretKeyId: string,
    ): Promise<string> {
        try {
            const user = await this.userRepo.findOne({
                where: {
                    userId: currentUser.userId,
                    organisationId: currentUser.organisationId,
                },
                relations: ['role'],
            });
            if (!user) {
                throw new NotFoundException('User not found');
            }

            const existingApiKey = await this.apiKeyRepo.findOne({
                where: {
                    id: secretKeyId,
                },
            });
            if (existingApiKey) {
                existingApiKey.isDisabled = true;
                await this.apiKeyRepo.save(existingApiKey);
                return 'API Key disabled successfully';
            } else {
                throw new BadRequestException('Invalid secret key');
            }
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                console.error('Error occurred while disabling API key:', error);
                throw new InternalServerErrorException(
                    'Couldn’t disable api key. Something went wrong!',
                );
            }
        }
    }

    async enableApiKey(currentUser: any, secretKeyId: string): Promise<string> {
        try {
            const user = await this.userRepo.findOne({
                where: {
                    userId: currentUser.userId,
                    organisationId: currentUser.organisationId,
                },
                relations: ['role'],
            });
            if (!user) {
                throw new NotFoundException('User not found');
            }

            const existingApiKey = await this.apiKeyRepo.findOne({
                where: {
                    id: secretKeyId,
                },
            });
            if (existingApiKey) {
                existingApiKey.isDisabled = false;
                await this.apiKeyRepo.save(existingApiKey);
                return 'API Key enabled successfully';
            } else {
                throw new BadRequestException('Invalid secret key');
            }
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                console.error('Error occurred while enabling API key:', error);
                throw new InternalServerErrorException(
                    'Couldn’t enable api key. Something went wrong!',
                );
            }
        }
    }
}
