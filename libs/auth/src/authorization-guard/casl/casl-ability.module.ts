import {
    Organisation,
    Permission,
    PostgresDBModule,
    Role,
    RolePermission,
    User,
} from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CaslAbilityRepository } from './casl-ability.repository';
import { CaslAbilityService } from './casl-ability.service';

@Module({
    imports: [
        PostgresDBModule,
        TypeOrmModule.forFeature(
            [User, Role, RolePermission, Permission, Organisation],
            'postgres',
        ),
    ],
    providers: [CaslAbilityFactory, CaslAbilityService, CaslAbilityRepository],
    exports: [CaslAbilityFactory],
})
export class CaslAbilityModule {}
