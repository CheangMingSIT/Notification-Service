import { UserValidationModule } from '@app/auth';
import { MongoDBModule, PostgresDBModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserAuthModule } from './user-auth/user-auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongoDBModule,
        PostgresDBModule,
        UserAuthModule,
        UserValidationModule,
    ],
})
export class CnsAuthenticationModule {}
