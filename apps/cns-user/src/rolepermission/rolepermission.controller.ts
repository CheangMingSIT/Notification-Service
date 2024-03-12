import { CheckPolicies, JwtAuthGuard, Operation } from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolePermissionDto } from './dtos/role-permission.dto';
import { SelectRoleIdDto } from './dtos/select-roleId.dto';
import { RolepermissionService } from './rolepermission.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiBearerAuth()
@ApiTags('RolePermission')
export class RolepermissionController {
    constructor(
        private readonly rolePermissionService: RolepermissionService,
    ) {}

    @Post('createRolePermission')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) =>
        ability.can(Operation.Create, 'RolePermission'),
    )
    createRolePermission(@Body() body: RolePermissionDto) {
        const response = this.rolePermissionService.createRoleWithPermission(
            body.role,
            body.hasFullDataControl,
            body.permission,
        );
        return response;
    }

    @Get('ListRolePermission')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) =>
        ability.can(Operation.Read, 'RolePermission'),
    )
    async listRolePermission(@Query() query: SelectRoleIdDto): Promise<Object> {
        const response = await this.rolePermissionService.listRolePermission(
            query.roleId,
        );
        return response;
    }
}
