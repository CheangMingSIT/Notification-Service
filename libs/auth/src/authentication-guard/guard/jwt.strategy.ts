import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import * as fs from 'fs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserValidationService } from '../user-validation.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: UserValidationService,
        configService: ConfigService,
    ) {
        const publicKeyFile = configService.get<string>('PUBLIC_KEY_FILE');
        const publicKey = fs.readFileSync(publicKeyFile, 'utf8');
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: publicKey,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        const refreshToken = req
            .get('Authorization')
            .replace('Bearer', '')
            .trim();

        if (payload.role === 'Owner') {
            return payload;
        }
        const validUser = await this.authService.validateRefreshToken(
            payload.userId,
            refreshToken,
        );
        if (!validUser) {
            throw new UnauthorizedException('Invalid User');
        }
        return {
            userId: payload.userId,
            email: payload.email,
            roleId: payload.roleId,
            organisationId: payload.organisationId,
            refreshToken: payload.refreshToken,
        };
    }
}
