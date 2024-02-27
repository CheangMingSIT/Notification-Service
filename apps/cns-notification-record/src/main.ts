import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
    DocumentBuilder,
    SwaggerDocumentOptions,
    SwaggerModule,
} from '@nestjs/swagger';
import { CnsNotificationRecordModule } from './cns-notification-record.module';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(CnsNotificationRecordModule);
    app.enableCors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    });
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.enableVersioning({
        type: VersioningType.URI,
    });
    const config = new DocumentBuilder()
        .setTitle('Notification Record')
        .setDescription('CM is the god of notification system api story')
        .setVersion('1.0')
        .addBearerAuth()
        .addSecurity('ApiKeyAuth', {
            type: 'apiKey',
            in: 'header',
            name: 'secretKey',
        })
        .build();
    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) =>
            methodKey,
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('cns-notification-record', app, document);

    await app.listen(3050);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
