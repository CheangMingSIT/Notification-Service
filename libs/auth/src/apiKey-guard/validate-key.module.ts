import { ApiKey, PostgresDBModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyStrategy } from './guard/api-auth.strategy';
import { ValidateKeyService } from './validate-key.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PassportModule.register({ defaultStrategy: 'headerapikey' }),
        PostgresDBModule,
        TypeOrmModule.forFeature([ApiKey], 'postgres'),
    ],
    providers: [ApiKeyStrategy, ValidateKeyService],
})
export class ValidateKeyModule {}
