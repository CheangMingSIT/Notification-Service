import { NestFactory } from '@nestjs/core';
import { NotificationApiModule } from './notification-api.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationApiModule);
  await app.listen(5000);
}
bootstrap();
