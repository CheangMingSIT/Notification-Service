import { Inject, Injectable } from '@nestjs/common';

import { EMAIL_SERVICE, email } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EmailApiService {
    constructor(
        @Inject(EMAIL_SERVICE) private readonly emailService: ClientProxy,
    ) {}

    sendEmail(message: string) {
        this.emailService.emit(email, message);
        return message;
    }
}
