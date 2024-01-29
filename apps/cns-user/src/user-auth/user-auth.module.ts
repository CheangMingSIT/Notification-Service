import { CaslAbilityModule } from '@app/auth';
import { Role, RolePermission, User } from '@app/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import { join } from 'path';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';

const reqPath = join(__dirname, '../');
const privateKey = fs.readFileSync(reqPath + 'keys/private.pem', 'utf8');
const publicKey = fs.readFileSync(reqPath + 'keys/public.pem', 'utf8');
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
        CaslAbilityModule,
        MailerModule.forRoot({
            transport: {
                host: 'smtp.office365.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'symphony-boss-dev@sptel.com',
                    pass: 'hbS31o&s2bGp@z8I',
                },
            },
            defaults: {
                from: '"No Reply" <noreply@sptel.com>',
            },
        }),
    ],
    controllers: [UserAuthController],
    providers: [UserAuthService],
})
export class UserAuthModule {}
