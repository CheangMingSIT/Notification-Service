import { NestFactory } from '@nestjs/core';
import { MessageQueueModule } from './message-queue.module';

async function bootstrap() {
  const app = await NestFactory.create(MessageQueueModule);
  await app.listen(3000);
}
bootstrap();
