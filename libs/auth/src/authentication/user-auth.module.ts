import { PostgresDBModule, User } from '@app/common';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import { join } from 'path';
import { JwtStrategy } from './guard/jwt.strategy';
import { LocalStrategy } from './guard/local.strategy';
import { UserAuthService } from './user-auth.service';

const reqPath = join(__dirname, '../');
const privateKey = fs.readFileSync(reqPath + 'keys/private.key', 'utf8');
const publicKey = fs.readFileSync(reqPath + 'keys/public.key', 'utf8');

@Module({
    imports: [
        PostgresDBModule,
        TypeOrmModule.forFeature([User], 'postgres'),
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
