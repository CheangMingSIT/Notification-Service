import { NestFactory } from '@nestjs/core';
import { WorkerServiceModule } from './worker-service.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(WorkerServiceModule);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5673'],
      queue: 'email_queue',
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
