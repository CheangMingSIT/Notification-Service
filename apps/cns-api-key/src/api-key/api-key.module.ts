import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CaslAbilityModule } from '@app/auth';
import { ApiKey, ApiKeySchema } from '@app/common';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: ApiKey.name,
                schema: ApiKeySchema,
            },
        ]),
        CaslAbilityModule,
    ],
    providers: [ApiKeyService],
    controllers: [ApiKeyController],
})
export class ApiAuthModule {}
