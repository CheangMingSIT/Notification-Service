import { CaslAbilityModule } from '@app/auth';
import { Permission, RolePermission } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Permission, RolePermission], 'postgres'),
        CaslAbilityModule,
    ],
    controllers: [PermissionController],
    providers: [PermissionService],
})
export class PermissionModule {}
