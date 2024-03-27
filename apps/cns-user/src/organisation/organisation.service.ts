import { Organisation, User } from '@app/common';
import { ForbiddenError } from '@casl/ability';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { orderBy } from 'lodash';
import { Repository } from 'typeorm';
import { createOrganisationDto } from './dtos/create-organisation.dto';

@Injectable()
export class OrganisationService {
    constructor(
        @InjectRepository(Organisation, 'postgres')
        private orgRepo: Repository<Organisation>,
        @InjectRepository(User, 'postgres')
        private userRepo: Repository<User>,
    ) {}

    async groupUserByOrganisation(user: any) {
        try {
            const organisations = await this.orgRepo.find({
                select: {
                    id: true,
                    name: true,
                    isDisabled: true,
                    users: {
                        userId: true,
                        name: true,
                        email: true,
                        role: {
                            role: true,
                        },
                    },
                },
                relations: {
                    users: {
                        role: true,
                    },
                },
            });
            const mappedOrganisation = organisations.map((org) => {
                const adminUsers = org.users.filter(
                    (user) => user.role.role === 'Admin',
                );
                const adminUserList = adminUsers.map((adminUser) => ({
                    userId: adminUser.userId,
                    name: adminUser.name,
                    email: adminUser.email,
                    role: adminUser.role.role,
                }));
                return {
                    id: org.id,
                    name: org.name,
                    isDisabled: org.isDisabled,
                    users: adminUserList.length > 0 ? adminUserList : [],
                };
            });
            const sortedGroup = orderBy(
                mappedOrganisation,
                [(org) => org.name.toLowerCase()],
                ['asc'],
            );
            return sortedGroup;
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

    async updateOrganisation(id: string, body: createOrganisationDto) {
        const { name } = body;
        try {
            const existingOrg = await this.orgRepo.findOne({
                where: { name },
            });
            if (existingOrg)
                throw new BadRequestException('Organisation already exists');
            await this.orgRepo.update({ id }, { name });
            return 'Organisation updated successfully';
        } catch (error) {
            console.error(error);
            if (error instanceof BadRequestException) throw error;
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
