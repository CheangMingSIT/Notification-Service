import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiAuthService } from './api-auth.service';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './guard/api-auth.strategy';
import { ApiKey, ApiKeySchema, DatabaseModule } from '@app/common';
import { ApiAuthController } from './api-auth.controller';

@Module({
    imports: [
        PassportModule,
        DatabaseModule,
        MongooseModule.forFeature([
            {
                name: ApiKey.name,
                schema: ApiKeySchema,
            },
        ]),
    ],
    providers: [ApiAuthService, ApiKeyStrategy],
    controllers: [ApiAuthController],
})
export class ApiAuthModule {}
