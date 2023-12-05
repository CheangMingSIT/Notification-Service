import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ApiAuthService } from './api-auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
    constructor(private authService: ApiAuthService) {
        super({ header: 'Authorization', prefix: '' }, true, (apikey, done) => {
            const checkKey = authService.validateApiKey(apikey);
            if (!checkKey) {
                return done(null, false);
            } else {
                done(null, checkKey);
            }
        });
    }
}
