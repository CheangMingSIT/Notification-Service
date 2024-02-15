import {
    AbilityBuilder,
    ExtractSubjectType,
    InferSubjects,
    MongoAbility,
    MongoQuery,
    createMongoAbility,
} from '@casl/ability';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import {
    ApiKey,
    NotificationLog,
    Permission,
    Role,
    RolePermission,
    User,
} from '@app/common';
import { CaslAbilityService } from './casl-ability.service';
import { Actions } from './enum/actions.enum';

type Subjects =
    | InferSubjects<
          | typeof User
          | typeof Role
          | typeof NotificationLog
          | typeof ApiKey
          | typeof Permission
          | typeof RolePermission,
          true
      >
    | 'all'
    | 'ViewAllNotificationLog';

export type AppAbility = MongoAbility<[Actions, Subjects], MongoQuery>;

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
                can(element.permission.action, element.permission.subject);
            });
        } catch (e) {
            console.error(e);
            throw new InternalServerErrorException('Casl Ability Error');
        }

        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
