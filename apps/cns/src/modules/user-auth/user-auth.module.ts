import { CaslAbilityModule } from '@app/auth';
import { Role, RolePermission, User } from '@app/common';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import { join } from 'path';
import { ApiAuthModule } from '../apiKey-auth/api-auth.module';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';

const reqPath = join(__dirname, '../');
const privateKey = fs.readFileSync(reqPath + 'keys/private.key', 'utf8');
const publicKey = fs.readFileSync(reqPath + 'keys/public.key', 'utf8');
@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role, RolePermission], 'postgres'),
        JwtModule.register({
            privateKey: privateKey,
            publicKey: publicKey,
            signOptions: {
                expiresIn: '1d',
                algorithm: 'RS256',
            },
        }),
        ApiAuthModule,
        CaslAbilityModule,
    ],
    controllers: [UserAuthController],
    providers: [UserAuthService],
})
export class UserAuthModule {}
