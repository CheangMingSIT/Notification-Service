import {
    ApiKeys,
    NotificationLog,
    NotificationLogSchema,
    RabbitMqModule,
} from '@app/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { WsService } from './ws.service';

@Module({
    imports: [
        RabbitMqModule,
        MulterModule.register({
            dest: './upload',
        }),
        MongooseModule.forFeature([
            { name: NotificationLog.name, schema: NotificationLogSchema },
        ]),
        TypeOrmModule.forFeature([ApiKeys], 'postgres'),
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
                adapter: new PugAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [WsService],
})
export class WsModule {}
