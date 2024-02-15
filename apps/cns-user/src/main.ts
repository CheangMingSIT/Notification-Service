import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
    DocumentBuilder,
    SwaggerDocumentOptions,
    SwaggerModule,
} from '@nestjs/swagger';
import { CnsUserModule } from './cns-user.module';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(CnsUserModule);
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.enableVersioning({
        type: VersioningType.URI,
    });
    const config = new DocumentBuilder()
        .setTitle('cns-users')
        .setDescription('CNS RBAC and RUD Users')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) =>
            methodKey,
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('cns-user', app, document);
    await app.listen(3070);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
