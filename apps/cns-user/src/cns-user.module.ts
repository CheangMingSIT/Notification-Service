import { UserValidationModule } from '@app/auth';
import { MongoDBModule, PostgresDBModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiAuthModule } from './api-key/api-key.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { RolepermissionModule } from './rolepermission/rolepermission.module';
import { UserAuthModule } from './user-auth/user-auth.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PostgresDBModule,
        MongoDBModule,
        UserModule,
        UserAuthModule,
        RoleModule,
        PermissionModule,
        RolepermissionModule,
        UserValidationModule,
        ApiAuthModule,
    ],
})
export class CnsUserModule {}
