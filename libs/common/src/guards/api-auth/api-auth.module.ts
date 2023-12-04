import { Module } from '@nestjs/common';
import { apiAuthService } from './api-auth.service';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './api-auth.strategy';

@Module({
    imports: [PassportModule],
    providers: [apiAuthService, ApiKeyStrategy],
})
export class ApiAuthModule {}
