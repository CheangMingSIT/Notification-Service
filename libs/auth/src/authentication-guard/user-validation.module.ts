import { PostgresDBModule, User } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './guard/jwt.strategy';
import { LocalStrategy } from './guard/local.strategy';
import { RefreshTokenStrategy } from './guard/refresh-token.strategy';
import { ResetPasswordStrategy } from './guard/reset-password-jwt.strategy';
import { UserValidationService } from './user-validation.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PostgresDBModule,
        TypeOrmModule.forFeature([User], 'postgres'),
        PassportModule,
    ],
    providers: [
        UserValidationService,
        LocalStrategy,
        JwtStrategy,
        RefreshTokenStrategy,
        ResetPasswordStrategy,
    ],
})
export class UserValidationModule {}
