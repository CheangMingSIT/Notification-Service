import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
    DocumentBuilder,
    SwaggerDocumentOptions,
    SwaggerModule,
} from '@nestjs/swagger';
import { CnsApiKeyModule } from './cns-api-key.module';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(CnsApiKeyModule);
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.enableVersioning({
        type: VersioningType.URI,
    });
    const config = new DocumentBuilder()
        .setTitle('CNS-ApiKey')
        .setDescription('Generate Key and List the Keys')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) =>
            methodKey,
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('cns-apiKey', app, document);
    await app.listen(3080);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
