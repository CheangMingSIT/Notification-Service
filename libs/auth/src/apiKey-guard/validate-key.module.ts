import { ApiKeys, PostgresDBModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyStrategy } from './guard/api-auth.strategy';
import { validateKeyService } from './validate-key.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PassportModule,
        PostgresDBModule,
        TypeOrmModule.forFeature([ApiKeys], 'postgres'),
    ],
    providers: [ApiKeyStrategy, validateKeyService],
})
export class validateKeyModule {}
