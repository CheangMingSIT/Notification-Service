import { NestFactory } from '@nestjs/core';
import { DlxNotificationApiModule } from './dlx-notification-api.module';

async function bootstrap() {
    const app = await NestFactory.create(DlxNotificationApiModule);
    await app.listen(3030);
}
bootstrap();
