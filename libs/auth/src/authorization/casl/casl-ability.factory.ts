import { Injectable } from '@nestjs/common';
import {
    AbilityBuilder,
    createMongoAbility,
    ExtractSubjectType,
    ForcedSubject,
    MongoAbility,
} from '@casl/ability';
import { Actions } from './enum/actions.enum';

const Subject = ['User', 'ApiKey', 'all'] as const;
export type AppAbility = MongoAbility<
    [
        Actions,
        (
            | (typeof Subject)[number]
            | ForcedSubject<Exclude<(typeof Subject)[number], 'all'>>
        ),
    ]
>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: any) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(
            createMongoAbility,
        );
        if (user.roleId === 1) {
            can(Actions.Manage, 'all');
        } else {
            cannot(Actions.Read, 'all');
            cannot(Actions.Manage, 'all');
        }
        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<typeof Subject>,
        });
    }
}
