import { UserValidationModule } from '@app/auth';
import { PostgresDBModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PostgresDBModule,
        UserModule,
        UserValidationModule,
    ],
})
export class CnsUserModule {}
