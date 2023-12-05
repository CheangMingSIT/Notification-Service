import { Module } from '@nestjs/common';
import { ApiAuthService } from './api-auth.service';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './api-auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import * as fs from 'fs';

const reqPath = join(__dirname, '../');
const privateKey = fs.readFileSync(reqPath + 'keys/private.key', 'utf8');
const publicKey = fs.readFileSync(reqPath + 'keys/public.key', 'utf8');
@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            privateKey: privateKey,
            publicKey: publicKey,
            signOptions: {
                algorithm: 'RS256',
            },
        }),
    ],
    providers: [ApiAuthService, ApiKeyStrategy],
    exports: [ApiAuthService],
})
export class ApiAuthModule {}
