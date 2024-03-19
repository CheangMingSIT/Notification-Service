import {
    AppAbility,
    CheckPolicies,
    JwtAuthGuard,
    Operation,
    PolicyGuard,
} from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import {
    Controller,
    Get,
    HttpStatus,
    Param,
    Req,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiTags('Roles')
@ApiBearerAuth()
export class RoleController {
    constructor(private roleService: RoleService) {}

    @Get('listRoles')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Operation.Read, 'Role'))
    @UseFilters(HttpExceptionFilter)
    async listRoles(@Req() req: any) {
        const response = await this.roleService.listRoles(req.user);
        return {
            status: HttpStatus.OK,
            data: response,
        };
    }

    @Get('roleListbasedOnOrganisationId/:organisationId')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @ApiParam({ name: 'organisationId', type: String })
    @CheckPolicies((ability: AppAbility) => ability.can(Operation.Read, 'Role'))
    @UseFilters(HttpExceptionFilter)
    async roleListbasedOnOrganisationId(
        @Param('organisationId') organisationId: string,
    ) {
        const response =
            await this.roleService.roleListbasedOnOrganisationId(
                organisationId,
            );
        return {
            status: HttpStatus.OK,
            data: response,
        };
    }
}
