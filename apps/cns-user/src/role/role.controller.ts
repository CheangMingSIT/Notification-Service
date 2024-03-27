import {
    AppAbility,
    CheckPolicies,
    JwtAuthGuard,
    Operation,
    PolicyGuard,
} from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
    Controller,
    Get,
    HttpStatus,
    Inject,
    Param,
    Req,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { RoleService } from './role.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiTags('Roles')
@ApiBearerAuth()
export class RoleController {
    constructor(
        private roleService: RoleService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

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

    @Get('dropDownRoles')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    async dropDownRoles(@Req() req: any) {
        const response = await this.roleService.roleListbasedOnOrganisationId(
            req.user.organisationId,
        );
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

    @Get('getRole')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    async getRole(@Req() req: any) {
        if (req.user.role === 'Owner') {
            return {
                status: HttpStatus.OK,
                data: req.user.role,
            };
        }
        const role = await this.cacheManager.get('role');
        if (role) {
            return {
                status: HttpStatus.OK,
                data: role,
            };
        }
        const response = await this.roleService.getRole(req.user.roleId);
        await this.cacheManager.set('role', response, 60);
        return {
            status: HttpStatus.OK,
            data: response,
        };
    }
}
