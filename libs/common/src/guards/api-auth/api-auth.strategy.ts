import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { apiAuthService } from './api-auth.service';
import { error } from 'console';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
    constructor(private authService: apiAuthService) {
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
