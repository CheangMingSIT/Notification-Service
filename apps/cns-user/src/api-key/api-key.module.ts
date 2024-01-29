import { Module } from '@nestjs/common';

import { CaslAbilityModule } from '@app/auth';
import { ApiKeys } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ApiKeys], 'postgres'),
        CaslAbilityModule,
    ],
    providers: [ApiKeyService],
    controllers: [ApiKeyController],
})
export class ApiAuthModule {}
