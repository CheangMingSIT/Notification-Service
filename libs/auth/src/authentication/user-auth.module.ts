import { Module } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import * as fs from 'fs';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './guard/local.strategy';
import { JwtStrategy } from './guard/jwt.strategy';

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
                expiresIn: '1d',
                algorithm: 'RS256',
            },
        }),
    ],
    providers: [UserAuthService, LocalStrategy, JwtStrategy],
})
export class UserAuthModule {}
