import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import * as fs from 'fs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { join } from 'path';
import { UserValidationService } from '../user-validation.service';

const reqPath = join(__dirname, '../');
const publicKey = fs.readFileSync(reqPath + 'keys/public.pem', 'utf8');

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(private authService: UserValidationService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
            return { ...payload, refreshToken };
        }
        const validUser = await this.authService.validateRefreshToken(
            payload,
            refreshToken,
        );

        if (!validUser) {
            throw new UnauthorizedException('Invalid User');
        }

        return { ...payload, refreshToken };
    }
}
