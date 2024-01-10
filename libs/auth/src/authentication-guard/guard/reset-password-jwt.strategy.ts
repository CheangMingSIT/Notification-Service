import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as fs from 'fs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { join } from 'path';

const reqPath = join(__dirname, '../');
const publicKey = fs.readFileSync(reqPath + 'keys/public.pem', 'utf8');

@Injectable()
export class ResetPasswordStrategy extends PassportStrategy(
    Strategy,
    'reset-password-jwt',
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
            ignoreExpiration: false,
            secretOrKey: publicKey,
        });
    }

    async validate(payload: any) {
        return {
            uuid: payload.uuid,
            email: payload.email,
            roleId: payload.roleId,
        };
    }
}
