import { Module } from '@nestjs/common';
import { EmailWsController } from './email-ws.controller';

@Module({
    controllers: [EmailWsController],
})
export class EmailWsModule {}
