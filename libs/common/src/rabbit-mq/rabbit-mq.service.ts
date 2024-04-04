import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    AmqpConnectionManager,
    ChannelWrapper,
    connect,
} from 'amqp-connection-manager';
import {
    DLQ_EMAIL,
    DLQ_SMS,
    DLX_EXCHANGE,
    EX_NOTIFICATION,
    QUEUE_EMAIL,
    QUEUE_SMS,
    RK_NOTIFICATION_EMAIL,
    RK_NOTIFICATION_SMS,
} from '../constants';

@Injectable()
export class RabbitmqService implements OnModuleInit {
    constructor(private readonly configService: ConfigService) {}
    // Queue Service interface
    private channel: ChannelWrapper;
    private connection: AmqpConnectionManager;

    onModuleInit() {
        console.log('Initializing RabbitMQ...');
        const rabbitmqUri = this.configService.get<string>('RABBITMQ_URI');
        this.connection = connect([rabbitmqUri]);
        this.connection.on('connect', () => {
            console.log('Connection to RabbitMQ up!');
        });

        this.connection.on('disconnect', (err) => {
            console.error('disconnection: ' + err);
        });

        this.connection.on('connectFailed', (err) => {
            console.error('connection failed: ' + err);
        });

        this.channel = this.connection.createChannel({
            json: true,
            setup: async (channel) => await this.setupRabbitMQ(channel),
            confirm: true,
        });

        this.channel.waitForConnect();
    }

    private async setupRabbitMQ(channel) {
        await channel.assertExchange(EX_NOTIFICATION, 'direct', {
            durable: true,
        });
        await channel.assertQueue(QUEUE_SMS, {
            durable: true,
            arguments: {
                'x-queue-type': 'quorum',
                'x-message-ttl': 10000,
                'x-dead-letter-exchange': DLX_EXCHANGE,
                'x-dead-letter-routing-key': RK_NOTIFICATION_SMS,
                'x-delivery-limit': 5,
            },
        });
        await channel.assertQueue(QUEUE_EMAIL, {
            durable: true,
            arguments: {
                'x-queue-type': 'quorum',
                'x-message-ttl': 10000,
                'x-dead-letter-exchange': DLX_EXCHANGE,
                'x-dead-letter-routing-key': RK_NOTIFICATION_EMAIL,
                'x-delivery-limit': 5,
            },
        });
        await channel.bindQueue(
            QUEUE_SMS,
            EX_NOTIFICATION,
            RK_NOTIFICATION_SMS,
        );
        await channel.bindQueue(
            QUEUE_EMAIL,
            EX_NOTIFICATION,
            RK_NOTIFICATION_EMAIL,
        );

        await channel.assertExchange(DLX_EXCHANGE, 'direct', {
            durable: true,
        });
        await channel.assertQueue(DLQ_EMAIL, { durable: true });
        await channel.assertQueue(DLQ_SMS, { durable: true });
        await channel.bindQueue(DLQ_SMS, DLX_EXCHANGE, RK_NOTIFICATION_SMS);
        await channel.bindQueue(DLQ_EMAIL, DLX_EXCHANGE, RK_NOTIFICATION_EMAIL);
    }

    public async publish(routingkey: string, message: any) {
        this.channel.waitForConnect();
        try {
            const result = await this.channel.publish(
                EX_NOTIFICATION,
                routingkey,
                Buffer.from(JSON.stringify(message)),
            );
            return result;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public async subscribe(queue: string, onMessage: (msg) => void) {
        const test = this.channel.waitForConnect();
        await this.channel.addSetup((channel: any) => {
            channel.consume(queue, (msg: any) => {
                if (msg) {
                    try {
                        const bufMsg = JSON.parse(msg.content.toString());
                        const message = JSON.parse(
                            Buffer.from(bufMsg.data).toString(),
                        );
                        onMessage(message);
                        channel.ack(msg);
                    } catch (error) {
                        console.error('Failed to process message:', error);
                        channel.nack(msg, false, true);
                    }
                }
            });
        });
    }
}
