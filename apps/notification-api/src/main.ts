import { NestFactory } from '@nestjs/core';
import { NotificationApiModule } from './notification-api.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(NotificationApiModule);
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.listen(5000);
}
bootstrap();
