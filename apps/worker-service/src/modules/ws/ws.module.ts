import { Module } from '@nestjs/common';
import { RabbitMqModule } from '@app/common';
import { WsService } from './ws.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [RabbitMqModule, MailerModule.forRoot({
        transport: {
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: 'symphony-boss-dev@sptel.com',
                pass: 'hbS31o&s2bGp@z8I'
            },
        },
        defaults: {
            from: '"No Reply" <noreply@sptel.com>',
        },

    })],
    providers: [WsService],
})
export class WsModule { }
