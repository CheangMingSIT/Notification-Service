import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { validateKeyService } from '../validate-key.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
    constructor(private keyValidation: validateKeyService) {
        super({ header: 'apikey', prefix: '' }, true, (apikey, done) => {
            const checkKey = keyValidation.validateApiKey(apikey);
            if (!checkKey) {
                return done(null, false);
            } else {
                done(null, checkKey);
            }
        });
    }
}
