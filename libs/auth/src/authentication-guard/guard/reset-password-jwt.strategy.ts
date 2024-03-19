import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserValidationService } from '../user-validation.service';

@Injectable()
export class ResetPasswordStrategy extends PassportStrategy(
    Strategy,
    'reset-password-jwt',
) {
    constructor(
        private configService: ConfigService,
        private authService: UserValidationService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
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
