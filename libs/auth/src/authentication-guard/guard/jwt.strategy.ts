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
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: UserValidationService) {
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
            refreshToken: payload.refreshToken,
        };
    }
}
