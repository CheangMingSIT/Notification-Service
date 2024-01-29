import { ApiKeys } from '@app/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class validateKeyService {
    constructor(
        @InjectRepository(ApiKeys, 'postgres')
        private apiKeyRepo: Repository<ApiKeys>,
    ) {}

    async validateApiKey(apikey: string): Promise<boolean> {
        const apiKeyRecord = await this.apiKeyRepo.findOneBy({
            apiKey: apikey,
        });
        if (!apiKeyRecord) {
            throw new UnauthorizedException('ApiKey not found!');
        }
        return true;
    }
}
