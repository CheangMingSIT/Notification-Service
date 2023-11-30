import { NestFactory } from '@nestjs/core';
import { NotificationLogApiModule } from './notification-log-api.module';

async function bootstrap() {
    const app = await NestFactory.create(NotificationLogApiModule);
    await app.listen(5020);
}
bootstrap();
