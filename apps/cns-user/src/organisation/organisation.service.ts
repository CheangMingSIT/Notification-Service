import { CaslAbilityFactory, Operation } from '@app/auth';
import { Organisation, User } from '@app/common';
import { ForbiddenError } from '@casl/ability';
import { rulesToAST } from '@casl/ability/extra';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { groupBy, orderBy } from 'lodash';
import { Repository } from 'typeorm';
import { createOrganisationDto } from './dtos/create-organisation.dto';
import { updateOrganisation } from './dtos/update-organisation.dto';

@Injectable()
export class OrganisationService {
    constructor(
        @InjectRepository(Organisation, 'postgres')
        private orgRepo: Repository<Organisation>,
        @InjectRepository(User, 'postgres')
        private userRepo: Repository<User>,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) {}

    private async mapBackConditionOperator(condition) {
        const operatorMapping = {
            $eq: 'equal',
            $ne: 'not equal',
            // Add more operators if needed
        };

        if (condition) {
            const revampedCondition = {
                condition: Object.keys(condition)[0],
                operator:
                    operatorMapping[
                        Object.keys(condition[Object.keys(condition)[0]])[0]
                    ],
                value: Object.values(condition[Object.keys(condition)[0]])[0],
            };
            return revampedCondition;
        }
        return null;
    }

    async groupUserByOrganisation(user: any) {
        try {
            const ability =
                await this.caslAbilityFactory.defineAbilitiesFor(user);
            ForbiddenError.from(ability)
                .setMessage('User cannot read organisation')
                .throwUnlessCan(Operation.Read, 'Organisation');
            const checkPolices = rulesToAST(
                ability,
                Operation.Read,
                'Organisation',
            );
            if (checkPolices['field'] === 'user.organisationId') {
                const organisations = await this.orgRepo.find({
                    relations: {
                        users: {
                            role: true,
                        },
                    },
                    where: { id: checkPolices['value'].toString() },
                });

                const mappedOrganisations = await Promise.all(
                    organisations.map(async (org) => {
                        const condition = await org.condition;
                        const mappedCondition = condition
                            ? await this.mapBackConditionOperator(condition)
                            : null;
                        return {
                            id: org.id,
                            name: org.name,
                            condition: mappedCondition,
                            isDisabled: org.isDisabled,
                            users: org.users.map((user) => {
                                return {
                                    userId: user.userId,
                                    name: user.name,
                                    role: user.role.role,
                                    email: user.email,
                                    isDisabled: user.isDisabled,
                                };
                            }),
                        };
                    }),
                );
                const promiseOrganisations =
                    await Promise.all(mappedOrganisations);
                const sortedGroup = orderBy(promiseOrganisations, [
                    (org) => org.name.toLowerCase(),
                ]);
                const groupUser = groupBy(sortedGroup, (org) => org.name);
                return groupUser;
            }
            const organisations = await this.orgRepo.find({
                relations: {
                    users: {
                        role: true,
                    },
                },
            });
            const mappedOrganisations = await Promise.all(
                organisations.map(async (org) => {
                    const condition = await org.condition;
                    const mappedCondition = condition
                        ? await this.mapBackConditionOperator(condition)
                        : null;
                    return {
                        id: org.id,
                        name: org.name,
                        condition: mappedCondition,
                        isDisabled: org.isDisabled,
                        users: org.users.map((user) => {
                            return {
                                userId: user.userId,
                                name: user.name,
                                role: user.role.role,
                                email: user.email,
                                isDisabled: user.isDisabled,
                            };
                        }),
                    };
                }),
            );
            const promiseOrganisations = await Promise.all(mappedOrganisations);
            const sortedGroup = orderBy(promiseOrganisations, [
                (org) => org.name.toLowerCase(),
            ]);
            const groupUser = groupBy(sortedGroup, (org) => org.name);
            return groupUser;
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message);
            }
            console.error(error);
            throw new InternalServerErrorException(
                'Error fetching organisations',
            );
        }
    }

    async listOrganisations(user: any) {
        try {
            const ability =
                await this.caslAbilityFactory.defineAbilitiesFor(user);
            ForbiddenError.from(ability)
                .setMessage('User cannot read organisation')
                .throwUnlessCan(Operation.Read, 'Organisation');
            const checkPolices = rulesToAST(
                ability,
                Operation.Read,
                'Organisation',
            );
            if (checkPolices['field'] === 'user.organisationId') {
                const organisations = await this.orgRepo.find({
                    where: { id: checkPolices['value'].toString() },
                });

                const mappedOrganisations = await Promise.all(
                    organisations.map(async (org) => {
                        const condition = await org.condition;
                        const mappedCondition = condition
                            ? await this.mapBackConditionOperator(condition)
                            : null;
                        return { ...org, condition: mappedCondition };
                    }),
                );
                const promiseOrganisations =
                    await Promise.all(mappedOrganisations);
                return promiseOrganisations;
            }
            const organisations = await this.orgRepo.find();
            const mappedOrganisations = await Promise.all(
                organisations.map(async (org) => {
                    const condition = await org.condition;
                    const mappedCondition = condition
                        ? await this.mapBackConditionOperator(condition)
                        : null;
                    return { ...org, condition: mappedCondition };
                }),
            );
            const promiseOrganisations = await Promise.all(mappedOrganisations);
            return promiseOrganisations;
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message);
            }
            console.error(error);
            throw new InternalServerErrorException(
                'Error fetching organisations',
            );
        }
    }

    private async mapConditionOperator(condition) {
        const operatorMapping = {
            equal: '$eq',
            'not equal': '$ne',
            // Add more operators if needed
        };

        if (condition && operatorMapping[condition.operator]) {
            const revampedCondition = {};
            revampedCondition[condition.condition] = {
                [operatorMapping[condition.operator]]: condition.value,
            };
            return revampedCondition;
        }
        return null;
    }

    async createOrganisation(body: createOrganisationDto) {
        const { name } = body;
        try {
            const existingOrg = await this.orgRepo.findOne({
                where: { name },
            });
            if (existingOrg)
                throw new BadRequestException('Organisation already exists');
            const newOrg = this.orgRepo.create({
                name,
            });
            await this.orgRepo.save(newOrg);
            return 'Organisation created successfully';
        } catch (error) {
            console.error(error);
            if (error instanceof BadRequestException) throw error;
            throw new InternalServerErrorException(
                'Error creating organisation',
            );
        }
    }

    async updateOrganisation(id: string, body: updateOrganisation) {
        const { name, condition } = body;
        try {
            const revampedCondition =
                await this.mapConditionOperator(condition);

            await this.orgRepo.update(
                { id: id },
                { name: name, condition: revampedCondition },
            );
            return 'Organisation updated successfully';
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Error updating organisation',
            );
        }
    }

    async disableOrganisation(id: string) {
        try {
            await this.orgRepo.update({ id }, { isDisabled: true });
            await this.userRepo.update(
                { organisationId: id },
                { isDisabled: true },
            );
            return 'Organisation disabled successfully';
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Error disabling organisation',
            );
        }
    }

    async enableOrganisation(id: string) {
        try {
            await this.orgRepo.update({ id }, { isDisabled: false });
            await this.userRepo.update(
                { organisationId: id },
                { isDisabled: false },
            );
            return 'Organisation enabled successfully';
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Error enabling organisation',
            );
        }
    }
}
