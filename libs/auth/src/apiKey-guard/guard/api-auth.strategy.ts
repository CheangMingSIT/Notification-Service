import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { ValidateKeyService } from '../validate-key.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
    constructor(private keyValidation: ValidateKeyService) {
        super({ header: 'secretKey', prefix: '' }, true, (apikey, done) => {
            const checkKey = keyValidation.validateApiKey(apikey);
            if (!checkKey) {
                return done(null, false);
            } else {
                done(null, checkKey);
            }
        });
    }
}
