import {
    ApiKey,
    NotificationLog,
    Organisation,
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
import { Operation } from './enum/permission.enum';
export type Resource =
    | InferSubjects<
          | typeof User
          | typeof Organisation
          | typeof Role
          | typeof NotificationLog
          | typeof ApiKey
          | typeof Permission
          | typeof RolePermission,
          true
      >
    | 'all';

export type AppAbility = MongoAbility<[Operation, Resource]>;

@Injectable()
export class CaslAbilityFactory {
    constructor(private readonly caslAbilityService: CaslAbilityService) {}
    async defineAbilitiesFor(user: any) {
        const { can, build } = new AbilityBuilder<AppAbility>(
            createMongoAbility,
        );
        let response: any;
        let condition: any;
        try {
            response = await this.caslAbilityService.identifyAbility(
                user.roleId,
            );
            condition = await this.caslAbilityService.identitfyConditions(
                user.userId,
            );
            response.forEach((element) => {
                can(
                    element.permission.operation,
                    element.permission.resource,
                    condition.condition,
                    // {
                    //     'user.organisationId':
                    //         '920779e0-7d28-4bef-a50c-2ded75ef26f7',
                    // },
                );
            });
        } catch (e) {
            console.error(e);
            throw new InternalServerErrorException('Casl Ability Error');
        }

        return build();
    }
}
