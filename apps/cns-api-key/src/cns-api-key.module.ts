import { UserValidationModule } from '@app/auth';
import { MongoDBModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiAuthModule } from './api-key/api-key.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongoDBModule,
        ApiAuthModule,
        UserValidationModule,
    ],
})
export class CnsApiKeyModule {}
