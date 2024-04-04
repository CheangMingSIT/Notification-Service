import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as fs from 'fs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserValidationService } from '../user-validation.service';
@Injectable()
export class ResetPasswordStrategy extends PassportStrategy(
    Strategy,
    'reset-password-jwt',
) {
    constructor(
        configService: ConfigService,
        private authService: UserValidationService,
    ) {
        const JWT_SECRET_FILE = configService.get<string>('JWT_SECRET_FILE');
        const JWT_SECRET = fs.readFileSync(JWT_SECRET_FILE, 'utf8');
        super({
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET,
        });
    }

    async validate(payload: any) {
        const { email } = payload;
        const user = await this.authService.getUserForResetPassword(email);
        return {
            userId: user.userId,
            email: user.email,
            roleId: user.roleId,
        };
    }
}
