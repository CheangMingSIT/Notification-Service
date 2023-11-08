import { Module } from '@nestjs/common';
import { SmsWsController } from './sms-ws.controller';
import { SmsWsService } from './sms-ws.service';

@Module({
  controllers: [SmsWsController],
  providers: [SmsWsService]
})
export class SmsWsModule {}
