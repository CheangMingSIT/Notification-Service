import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NotificationRecordApiModule } from './notification-record-api.module';

async function bootstrap() {
    const app = await NestFactory.create(NotificationRecordApiModule);
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.listen(5051);
}
bootstrap();
