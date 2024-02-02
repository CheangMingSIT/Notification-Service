import {
    AbilityBuilder,
    createMongoAbility,
    ExtractSubjectType,
    MongoAbility,
} from '@casl/ability';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CaslAbilityService } from './casl-ability.service';

const Actions = ['manage', 'create', 'read', 'update', 'delete'] as const;
const Subject = [
    'User',
    'ApiKey',
    'NotificationRecord',
    'Permission',
    'RolePermission',
    'all',
] as const;

export type AppAbility = MongoAbility<
    [
        (typeof Actions)[number],
        (typeof Subject)[number] | Exclude<(typeof Subject)[number], 'all'>,
    ]
>;

@Injectable()
export class CaslAbilityFactory {
    constructor(private readonly caslAbilityService: CaslAbilityService) {}
    async createForUser(user: any) {
        const { can, build } = new AbilityBuilder<AppAbility>(
            createMongoAbility,
        );
        let response: any;
        try {
            response = await this.caslAbilityService.identifyAbility(
                user.roleId,
            );

            response.forEach((element) => {
                can(
                    element.permission.action as (typeof Actions)[number],
                    element.permission.subject as (typeof Subject)[number],
                );
            });

            // if super admin, can manage all
            // if system operator, can read the notification record that is tied to the apikeys that they generated
            // if user, can read the notification record tied to their personal apikey
        } catch (e) {
            console.error(e);
            throw new InternalServerErrorException('Casl Ability Error');
        }

        return build({
            detectSubjectType: (item) =>
                item as ExtractSubjectType<typeof Subject>,
        });
    }
}
