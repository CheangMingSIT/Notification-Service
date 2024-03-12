import { Organisation } from '@app/common';
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createOrganisationDto } from './dtos/create-organisation.dto';
import { updateOrganisation } from './dtos/update-organisation.dto';

@Injectable()
export class OrganisationService {
    constructor(
        @InjectRepository(Organisation, 'postgres')
        private orgRepo: Repository<Organisation>,
    ) {}

    async listOrganisations() {
        try {
            const organisations = await this.orgRepo.find();
            return organisations;
        } catch (error) {
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
        const { condition } = body;
        try {
            const revampedCondition =
                await this.mapConditionOperator(condition);

            await this.orgRepo.update(id, revampedCondition);
            return 'Organisation updated successfully';
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Error updating organisation',
            );
        }
    }
}
