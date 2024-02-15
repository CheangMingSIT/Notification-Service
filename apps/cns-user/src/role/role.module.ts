import { CaslAbilityModule } from '@app/auth';
import { Role } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
    imports: [TypeOrmModule.forFeature([Role], 'postgres'), CaslAbilityModule],
    controllers: [RoleController],
    providers: [RoleService],
})
export class RoleModule {}
