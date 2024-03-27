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
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(
            createMongoAbility,
        );
        let response: any;
        try {
            if (user.role === 'Owner') {
                can(Operation.Manage, 'all');
                cannot(Operation.Read, 'User');
                cannot(Operation.Read, 'Role');
            } else {
                response = await this.caslAbilityService.identifyAbility(
                    user.roleId,
                );
                response.forEach((element) => {
                    can(
                        element.permission.operation,
                        element.permission.resource,
                        {
                            'user.organisationId': user.organisationId,
                        },
                    );
                    cannot(Operation.Read, 'Organisation');
                });
            }
        } catch (e) {
            console.error(e);
            throw new InternalServerErrorException('Casl Ability Error');
        }

        return build();
    }
}
