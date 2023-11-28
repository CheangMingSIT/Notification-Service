import { Module } from '@nestjs/common';
import {
    NotificationLog,
    NotificationLogSchema,
    RabbitMqModule,
    RabbitmqService,
} from '@app/common';
import { WsService } from './ws.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        RabbitMqModule,
        MulterModule.register({
            dest: './upload',
        }),
        MongooseModule.forFeature([
            { name: NotificationLog.name, schema: NotificationLogSchema },
        ]),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.office365.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'symphony-boss-dev@sptel.com',
                    pass: 'hbS31o&s2bGp@z8I',
                },
            },
            defaults: {
                from: '"No Reply" <noreply@sptel.com>',
            },
        }),
    ],
    providers: [WsService],
})
export class WsModule {}
