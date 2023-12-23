import { ApiKey, ApiKeySchema, MongoDBModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './guard/api-auth.strategy';
import { validateKeyService } from './validate-key.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PassportModule,
        MongoDBModule,
        MongooseModule.forFeature([
            {
                name: ApiKey.name,
                schema: ApiKeySchema,
            },
        ]),
    ],
    providers: [ApiKeyStrategy, validateKeyService],
})
export class validateKeyModule {}
