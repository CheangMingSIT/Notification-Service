import { NestFactory } from '@nestjs/core';
import { NotificationRecordApiModule } from './notification-record-api.module';

async function bootstrap() {
    const app = await NestFactory.create(NotificationRecordApiModule);
    await app.listen(5051);
}
bootstrap();
