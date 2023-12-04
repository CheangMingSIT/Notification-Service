import { Module } from '@nestjs/common';

import { DlxApiModule } from './modules/dlx-api/dlx-api.module';
import { DatabaseModule } from '@app/common';

@Module({
    imports: [DatabaseModule, DlxApiModule],
})
export class DlxNotificationApiModule {}
