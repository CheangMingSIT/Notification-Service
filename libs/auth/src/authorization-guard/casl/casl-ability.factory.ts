import {
    ApiKey,
    NotificationLog,
    Permission,
    Role,
    RolePermission,
    User,
} from '@app/common';
import {
    AbilityBuilder,
    InferSubjects,
    MongoAbility,
    createMongoAbility,
} from '@casl/ability';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CaslAbilityService } from './casl-ability.service';
import { Actions } from './enum/actions.enum';
export type Subjects =
    | InferSubjects<
          | typeof User
          | typeof Role
          | typeof NotificationLog
          | typeof ApiKey
          | typeof Permission
          | typeof RolePermission,
          true
      >
    | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    constructor(private readonly caslAbilityService: CaslAbilityService) {}
    async defineAbilitiesFor(user: any) {
        const { can, build } = new AbilityBuilder<AppAbility>(
            createMongoAbility,
        );
        let response: any;
        try {
            response = await this.caslAbilityService.identifyAbility(
                user.roleId,
                user.userId,
            );
            response.forEach((element) => {
                can(
                    element.permission.action,
                    element.permission.subject,
                    element.permission.condition,
                );
            });
        } catch (e) {
            console.error(e);
            throw new InternalServerErrorException('Casl Ability Error');
        }

        return build();
    }

    // async defineAbilitiesFor(user: any) {
    //     const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    //         createMongoAbility,
    //     );

    //     can(Actions.Read, 'NotificationLog', {
    //         userId: { $eq: user.userId },
    //     });
    //     can(Actions.Read, 'ApiKey', null);

    //     return build();
    // }
}
