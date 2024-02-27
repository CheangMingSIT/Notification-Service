import { Injectable } from '@nestjs/common';
import { CaslAbilityRepository } from './casl-ability.repository';

@Injectable()
export class CaslAbilityService {
    constructor(private caslAbilityRepository: CaslAbilityRepository) {}

    async identifyAbility(roleId: any, userId: any) {
        return await this.caslAbilityRepository.identifyAbility(roleId, userId);
    }
}
