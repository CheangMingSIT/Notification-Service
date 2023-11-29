import { Module } from '@nestjs/common';
import {
    NotificationLog,
    NotificationLogSchema,
    RabbitMqModule,
} from '@app/common';
import { WsService } from './ws.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

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
            template: {
                dir: join(__dirname + '/template'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [WsService],
})
export class WsModule {}
