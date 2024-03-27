import {
    AppAbility,
    CheckPolicies,
    JwtAuthGuard,
    Operation,
    PolicyGuard,
} from '@app/auth';
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
import { OrganisationService } from './organisation.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiTags('Organisation')
export class OrganisationController {
    constructor(private orgService: OrganisationService) {}

    @Get('GroupUsersByOrganisation')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @ApiBearerAuth()
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Operation.Read, 'Organisation'),
    )
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

    @Patch('updateOrganisation/:organisationId')
    @ApiBearerAuth()
    @ApiParam({ name: 'organisationId', required: true })
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    async updateOrganisation(
        @Param('organisationId') organisationId: string,
        @Body() body: createOrganisationDto,
    ) {
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
    @ApiBearerAuth()
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
    @ApiBearerAuth()
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
