import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    UseFilters,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { createOrganisationDto } from './dtos/create-organisation.dto';
import { updateOrganisation } from './dtos/update-organisation.dto';
import { OrganisationService } from './organisation.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiTags('Organisation')
export class OrganisationController {
    constructor(private orgService: OrganisationService) {}

    @Get('listOrganisations')
    @UseFilters(HttpExceptionFilter)
    async listOrganisations() {
        const response = await this.orgService.listOrganisations();
        return {
            status: HttpStatus.OK,
            data: response,
        };
    }

    @Post('createOrganisation')
    @UseFilters(HttpExceptionFilter)
    async createOrganisation(@Body() body: createOrganisationDto) {
        const response = await this.orgService.createOrganisation(body);
        return {
            status: HttpStatus.CREATED,
            data: response,
        };
    }

    @Patch('updateOrganisation/:organisationId')
    @ApiParam({ name: 'organisationId', required: true })
    @UseFilters(HttpExceptionFilter)
    async updateOrganisation(
        @Param('organisationId') organisationId: string,
        @Body() body: updateOrganisation,
    ) {
        if (
            body.condition &&
            (body.condition.condition === null ||
                body.condition.condition === '' ||
                body.condition.operator === null ||
                body.condition.operator === '' ||
                body.condition.value === null ||
                body.condition.value === '')
        ) {
            body.condition = null;
        }
        const response = await this.orgService.updateOrganisation(
            organisationId,
            body,
        );
        return {
            status: HttpStatus.OK,
            data: response,
        };
    }
}
