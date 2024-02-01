import { ApiKey } from '@app/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ValidateKeyService {
    constructor(
        @InjectRepository(ApiKey, 'postgres')
        private apiKeyRepo: Repository<ApiKey>,
    ) {}

    async validateApiKey(apikey: string): Promise<boolean> {
        const apiKeyRecord = await this.apiKeyRepo.findOneBy({
            secretKey: apikey,
        });
        if (!apiKeyRecord) {
            throw new UnauthorizedException('secretKey not found!');
        }
        return true;
    }
}
