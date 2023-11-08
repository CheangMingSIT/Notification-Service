import { email } from '@app/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('email-ws')
export class EmailWsController {
    @EventPattern(email)
    notifySMS(@Payload() data: any) {
        console.log('email-Queue', data);
    }
}
