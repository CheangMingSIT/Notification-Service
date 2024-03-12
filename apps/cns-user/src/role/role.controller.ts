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
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
    async listRoles() {
        const response = await this.roleService.listRoles();
        return {
            status: HttpStatus.OK,
            data: response,
        };
    }
}
