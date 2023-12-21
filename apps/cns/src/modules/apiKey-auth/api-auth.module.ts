import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { CaslAbilityModule } from '@app/auth';
import { ApiKey, ApiKeySchema } from '@app/common';
import { ApiAuthController } from './api-auth.controller';
import { ApiAuthService } from './api-auth.service';
import { ApiKeyStrategy } from './guard/api-auth.strategy';

@Module({
    imports: [
        PassportModule,
        MongooseModule.forFeature([
            {
                name: ApiKey.name,
                schema: ApiKeySchema,
            },
        ]),
        CaslAbilityModule,
    ],
    providers: [ApiAuthService, ApiKeyStrategy],
    controllers: [ApiAuthController],
})
export class ApiAuthModule {}
