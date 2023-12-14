import {
    AbilityBuilder,
    createMongoAbility,
    ExtractSubjectType,
    MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { CaslAbilityService } from './casl-ability.service';

const Actions = ['manage', 'create', 'read', 'update', 'delete'] as const;
const Subject = ['User', 'ApiKey', 'NotificationRecord', 'all'] as const;

export type AppAbility = MongoAbility<
    [
        (typeof Actions)[number] | Exclude<(typeof Actions)[number], null>,
        (typeof Subject)[number] | Exclude<(typeof Subject)[number], null>,
    ]
>;

@Injectable()
export class CaslAbilityFactory {
    constructor(private readonly caslAbilityService: CaslAbilityService) {}
    async createForUser(user: any) {
        const { can, build } = new AbilityBuilder<AppAbility>(
            createMongoAbility,
        );
        const response = await this.caslAbilityService.identifyAbility(
            user.roleId,
        );
        response.forEach((element) => {
            can(
                element.permission.action as (typeof Actions)[number],
                element.permission.subject as (typeof Subject)[number],
            );
        });
        if (user === true) {
            can('read', 'NotificationRecord');
        }
        return build({
            detectSubjectType: (item) =>
                item as ExtractSubjectType<typeof Subject>,
        });
    }
}
