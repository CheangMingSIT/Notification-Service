import { sms } from '@app/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class SmsWsController {
    @EventPattern(sms)
    notifySMS(@Payload() data: any) {
        console.log('SMS-Queue', data);
    }
}
