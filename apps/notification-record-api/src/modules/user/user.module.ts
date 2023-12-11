import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import * as fs from 'fs';
import { ApiAuthModule } from '../api-auth/api-auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/common';

const reqPath = join(__dirname, '../');
const privateKey = fs.readFileSync(reqPath + 'keys/private.key', 'utf8');
const publicKey = fs.readFileSync(reqPath + 'keys/public.key', 'utf8');
@Module({
    imports: [
        TypeOrmModule.forFeature([User], 'postgres'),
        JwtModule.register({
            privateKey: privateKey,
            publicKey: publicKey,
            signOptions: {
                expiresIn: '1d',
                algorithm: 'RS256',
            },
        }),
        ApiAuthModule,
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
