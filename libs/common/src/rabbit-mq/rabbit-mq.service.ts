import { Injectable, OnModuleInit } from '@nestjs/common';
import {
    connect,
    ChannelWrapper,
    AmqpConnectionManager,
} from 'amqp-connection-manager';
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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitmqService implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService, // Remove @Inject as it's not needed
    ) {}
    // Queue Service interface
    private channel: ChannelWrapper;
    private connection: AmqpConnectionManager;
    private setupPromise: Promise<void>;

    onModuleInit() {
        console.log('Initializing RabbitMQ...');
        const rabbitmqUri = this.configService.get<string>('RABBITMQ_URI');
        this.connection = connect([rabbitmqUri]);
        this.connection.on('connect', () => {
            this.setupPromise = this.setupRabbitMQ();
            console.log('Connection to RabbitMQ up!');
        });

        this.connection.on('disconnect', (err) => {
            console.error(err);
        });

        this.connection.on('connectFailed', (err) => {
            console.error(err);
        });
    }

    private async setupRabbitMQ() {
        const channel = this.connection.createChannel({
            json: true,
        });

        await channel.waitForConnect();

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

        this.channel = channel;
    }

    public async publish(routingkey: string, message: any) {
        try {
            await this.setupPromise;
            return this.channel.publish(
                EX_NOTIFICATION,
                routingkey,
                Buffer.from(JSON.stringify(message)),
            );
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public async subscribe(queue: string, onMessage: (msg) => void) {
        await this.setupPromise;
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
