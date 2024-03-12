import { User } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaslAbilityRepository } from './casl-ability.repository';

@Injectable()
export class CaslAbilityService {
    constructor(
        private caslAbilityRepository: CaslAbilityRepository,
        @InjectRepository(User, 'postgres')
        private userOrg: Repository<User>,
    ) {}

    async identifyAbility(roleId: any) {
        return await this.caslAbilityRepository.identifyAbility(roleId);
    }

    async identitfyConditions(userId: any) {
        const userOrg = await this.userOrg.findOne({
            where: { userId },
            relations: ['organisation'],
        });
        return userOrg.organisation;
    }
}
