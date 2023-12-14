import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NotificationApiModule } from './notification-api.module';

async function bootstrap() {
    const app = await NestFactory.create(NotificationApiModule);
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.enableVersioning({
        type: VersioningType.URI,
    });
    await app.listen(3000);
}
bootstrap();
