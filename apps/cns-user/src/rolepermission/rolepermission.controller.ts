import { CheckPolicies, JwtAuthGuard } from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import {
    Body,
    Controller,
    Delete,
    Post,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionRoleDto } from './dtos/rolepermission.dto';
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
    @CheckPolicies((ability: any) => ability.can('create', 'RolePermission'))
    createRolePermission(@Body() body: PermissionRoleDto) {
        return this.rolePermissionService.associatePermissionsToRole(
            body.roleId,
            body.permissionId,
        );
    }

    @Delete('deleteRolePermission')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) => ability.can('delete', 'RolePermission'))
    deleteRolePermission(@Body() body: PermissionRoleDto) {
        return this.rolePermissionService.deleteAssociatePermissionsToRole(
            body.roleId,
            body.permissionId,
        );
    }
}
