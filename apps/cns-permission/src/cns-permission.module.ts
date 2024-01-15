import { UserValidationModule } from '@app/auth';
import { PostgresDBModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PermissionModule } from './permission/permission.module';
import { RolepermissionModule } from './rolepermission/rolepermission.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PermissionModule,
        PostgresDBModule,
        UserValidationModule,
        RolepermissionModule,
    ],
    controllers: [],
})
export class CnsPermissionModule {}
