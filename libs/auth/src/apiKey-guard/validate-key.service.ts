import { ApiKey } from '@app/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class validateKeyService {
    constructor(
        @InjectModel(ApiKey.name) private apiKeyRecord: Model<ApiKey>,
    ) {}

    async validateApiKey(apikey: string): Promise<boolean> {
        const apiKeyRecord = await this.apiKeyRecord.findOne({
            apiKey: apikey,
        });
        if (!apiKeyRecord) {
            throw new UnauthorizedException('ApiKey not found!');
        }
        return true;
    }
}
