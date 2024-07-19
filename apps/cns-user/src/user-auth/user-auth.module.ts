import { CaslAbilityModule } from '@app/auth';
import { ApiKey, Role, RolePermission, User } from '@app/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_FILE, 'utf8');
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_FILE, 'utf8');
@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature(
            [User, Role, RolePermission, ApiKey],
            'postgres',
        ),
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
                    user: 'cheangming@hotmail.com',
                    pass: 'leotiger1998',
                },
            },
            defaults: {
                from: 'Hello1998@outlook.sg',
            },
        }),
    ],
    controllers: [UserAuthController],
    providers: [UserAuthService],
})
export class UserAuthModule {}
