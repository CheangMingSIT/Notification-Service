import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, ChannelWrapper } from 'amqp-connection-manager';
import {
    QUEUE_EMAIL,
    QUEUE_SMS,
    EX_NOTIFICATION,
    RK_NOTIFICATION_EMAIL,
    RK_NOTIFICATION_SMS,
    DLX_EXCHANGE,
    DLQ_SMS,
    DLQ_EMAIL,
} from '../constants';
@Injectable()
export class RabbitmqService implements OnModuleInit {
    // Queue Service interface
    private channel: ChannelWrapper;

    async onModuleInit() {
        console.log('Initializing RabbitMQ...');
        const connection = connect(['amqp://localhost:5673']);

        this.channel = connection.createChannel({
            json: true,
            setup: async (channel) => await this.setupRabbitMQ(channel),
        });

        connection.on('close', () => {
            console.warn('Connection to RabbitMQ closed!');
        });

        connection.on('error', (err) => {
            console.error('Error in RabbitMQ connection:', err);
        });
    }

    private async setupRabbitMQ(channel) {
        await channel.assertExchange(EX_NOTIFICATION, 'direct', {
            durable: true,
        });
        await channel.assertQueue(QUEUE_SMS, {
            durable: true,
            arguments: {
                'x-queue-type': 'quorum',
                'x-message-ttl': 100000,
                'x-dead-letter-exchange': DLX_EXCHANGE,
                'x-dead-letter-routing-key': RK_NOTIFICATION_SMS,
                'x-delivery-limit': 5,
            },
            function(err, ok) {
                if (err) {
                    console.log(err);
                }
                console.log(ok);
            },
        });
        await channel.assertQueue(QUEUE_EMAIL, {
            durable: true,
            arguments: {
                'x-queue-type': 'quorum',
                'x-message-ttl': 100000,
                'x-dead-letter-exchange': DLX_EXCHANGE,
                'x-dead-letter-routing-key': RK_NOTIFICATION_EMAIL,
                'x-delivery-limit': 5,
            },
            function(err, ok) {
                if (err) {
                    console.log(err);
                }
                console.log(ok);
            },
        });

        await channel.assertExchange(DLX_EXCHANGE, 'direct', {
            durable: true,
        });
        await channel.assertQueue(DLQ_SMS, { durable: true });
        await channel.assertQueue(DLQ_EMAIL, { durable: true });

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

        await channel.bindQueue(DLQ_SMS, DLX_EXCHANGE, RK_NOTIFICATION_SMS);
        await channel.bindQueue(DLQ_EMAIL, DLX_EXCHANGE, RK_NOTIFICATION_EMAIL);
    }

    public async publish(routingkey: string, message: any) {
        return await this.channel.publish(
            EX_NOTIFICATION,
            routingkey,
            Buffer.from(JSON.stringify(message)),
        );
    }

    public async subscribe(queue: string, onMessage: (msg) => void) {
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
