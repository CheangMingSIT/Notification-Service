import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { ApiAuthService } from './api-auth.service';
import { ApiKeyStrategy } from './guard/api-auth.strategy';
import { ApiKey, ApiKeySchema } from '@app/common';
import { ApiAuthController } from './api-auth.controller';
import { CaslAbilityModule } from '@app/auth';

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
