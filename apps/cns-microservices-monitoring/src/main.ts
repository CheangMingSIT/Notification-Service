import { NestFactory } from '@nestjs/core';
import { CnsMicroservicesMonitoringModule } from './cns-microservices-monitoring.module';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(CnsMicroservicesMonitoringModule);
    await app.listen(5012);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
