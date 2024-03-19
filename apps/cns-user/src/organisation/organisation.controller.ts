import { JwtAuthGuard } from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Req,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { createOrganisationDto } from './dtos/create-organisation.dto';
import { updateOrganisation } from './dtos/update-organisation.dto';
import { OrganisationService } from './organisation.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiTags('Organisation')
export class OrganisationController {
    constructor(private orgService: OrganisationService) {}

    @Get('listOrganisations')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseFilters(HttpExceptionFilter)
    async listOrganisations(@Req() req: any) {
        const response = await this.orgService.listOrganisations(req.user);
        return {
            status: HttpStatus.OK,
            data: response,
        };
    }

    @Get('GroupUsersByOrganisation')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseFilters(HttpExceptionFilter)
    async groupUsersByOrganisation(@Req() req: any) {
        const response = await this.orgService.groupUserByOrganisation(
            req.user,
        );
        return {
            status: HttpStatus.OK,
            data: response,
        };
    }

    @Post('createOrganisation')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    async createOrganisation(@Body() body: createOrganisationDto) {
        const response = await this.orgService.createOrganisation(body);
        return {
            status: HttpStatus.CREATED,
            data: response,
        };
    }

    @Patch('editCondition/:organisationId')
    @ApiParam({ name: 'organisationId', required: true })
    @UseFilters(HttpExceptionFilter)
    async addCondition(
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

    @Patch('disableOrganisation/:organisationId')
    @ApiParam({ name: 'organisationId', required: true })
    @UseFilters(HttpExceptionFilter)
    async disableOrganisation(@Param('organisationId') organisationId: string) {
        const response =
            await this.orgService.disableOrganisation(organisationId);
        return {
            status: HttpStatus.OK,
            data: response,
        };
    }

    @Patch('enableOrganisation/:organisationId')
    @ApiParam({ name: 'organisationId', required: true })
    @UseFilters(HttpExceptionFilter)
    async enableOrganisation(@Param('organisationId') organisationId: string) {
        const response =
            await this.orgService.enableOrganisation(organisationId);
        return {
            status: HttpStatus.OK,
            data: response,
        };
    }
}
