import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
    DocumentBuilder,
    SwaggerDocumentOptions,
    SwaggerModule,
} from '@nestjs/swagger';
import { NotificationRecordApiModule } from './notification-record-api.module';

async function bootstrap() {
    const app = await NestFactory.create(NotificationRecordApiModule);
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.enableVersioning({
        type: VersioningType.URI,
    });
    const config = new DocumentBuilder()
        .setTitle('Notification System')
        .setDescription('CM is the god of notification system api story')
        .setVersion('1.0')
        .addBearerAuth()
        .addSecurity('ApiKeyAuth', {
            type: 'apiKey',
            in: 'header',
            name: 'apiKey',
        })
        .build();
    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) =>
            methodKey,
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('notification-system-api', app, document);
    await app.listen(5051);
}
bootstrap();
