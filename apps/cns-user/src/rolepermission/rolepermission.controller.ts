import { CheckPolicies, JwtAuthGuard } from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Patch,
    Post,
    Query,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolePermissionDto } from './dtos/rolepermission.dto';
import { SelectRoleIdDto } from './dtos/selectRoleId.dto';
import { updateRolePermissionDto } from './dtos/updateRolePermission.dto';
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
    createRolePermission(@Body() body: RolePermissionDto) {
        const response = this.rolePermissionService.createRoleWithPermission(
            body.role,
            body.permissionId,
        );
        return {
            status: HttpStatus.OK,
            message: response,
        };
    }

    @Patch('updateRolePermission')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) => ability.can('update', 'RolePermission'))
    updateRolePermission(@Body() body: updateRolePermissionDto) {
        const response = this.rolePermissionService.updateRoleWithPermission(
            body.roleId,
            body.permissionId,
        );
        return {
            status: HttpStatus.OK,
            response: response,
        };
    }

    @Delete('deleteRole')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) => ability.can('delete', 'RolePermission'))
    deleteRole(@Body() body: SelectRoleIdDto) {
        const response = this.rolePermissionService.deleteRole(body.roleId);
        return {
            status: HttpStatus.OK,
            response: response,
        };
    }

    @Get('ListRolePermission')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) => ability.can('read', 'RolePermission'))
    async listRolePermission(@Query() query: SelectRoleIdDto): Promise<Object> {
        const response = await this.rolePermissionService.listRolePermission(
            query.roleId,
        );
        return {
            status: HttpStatus.OK,
            response: JSON.parse(JSON.stringify(response)),
        };
    }
}
