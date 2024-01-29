import { CaslAbilityModule } from '@app/auth';
import { RolePermission } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolepermissionController } from './rolepermission.controller';
import { RolepermissionService } from './rolepermission.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([RolePermission], 'postgres'),
        CaslAbilityModule,
    ],
    controllers: [RolepermissionController],
    providers: [RolepermissionService],
})
export class RolepermissionModule {}
