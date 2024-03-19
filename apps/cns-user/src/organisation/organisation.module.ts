import { CaslAbilityModule } from '@app/auth';
import { Organisation, User } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Organisation, User], 'postgres'),
        CaslAbilityModule,
    ],
    controllers: [OrganisationController],
    providers: [OrganisationService],
})
export class OrganisationModule {}
