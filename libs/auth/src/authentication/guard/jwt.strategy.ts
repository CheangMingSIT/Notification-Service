import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';

const reqPath = join(__dirname, '../');
const publicKey = fs.readFileSync(reqPath + 'keys/public.key', 'utf8');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: publicKey,
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.sub,
            username: payload.username,
            roles: payload.roles,
        };
    }
}
