import { CheckPolicies, JwtAuthGuard, Operation } from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { RolePermissionDto } from './dtos/role-permission.dto';
import { updateRolePermissionDto } from './dtos/update-role-permission.dto';
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
    createRolePermission(@Req() req: any, @Body() body: RolePermissionDto) {
        const response = this.rolePermissionService.createRoleWithPermission(
            req.user.organisationId,
            body.role,
            body.hasFullDataControl,
            body.permission,
        );
        return {
            status: HttpStatus.CREATED,
            data: response,
        };
    }

    @Get('getRolePermission/:roleId')
    @ApiParam({ name: 'roleId', type: Number })
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) =>
        ability.can(Operation.Read, 'RolePermission'),
    )
    async getRolePermission(
        @Param('roleId', ParseIntPipe) roleId: number,
    ): Promise<Object> {
        const response =
            await this.rolePermissionService.getRolePermission(roleId);
        return {
            status: HttpStatus.OK,
            data: response,
        };
    }

    @Patch('updateRolePermission/:roleId')
    @UseGuards(JwtAuthGuard)
    @ApiParam({ name: 'roleId', type: Number })
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) =>
        ability.can(Operation.Update, 'RolePermission'),
    )
    async updateRolePermission(
        @Param('roleId', ParseIntPipe) roleId: number,
        @Body() body: updateRolePermissionDto,
    ) {
        const response =
            await this.rolePermissionService.updateRoleWithPermission(
                roleId,
                body.role,
                body.hasFullDataControl,
                body.permission,
            );
        return {
            status: HttpStatus.ACCEPTED,
            data: response,
        };
    }

    @Patch('disableRolePermission/:roleId')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    @ApiParam({ name: 'roleId', type: Number })
    @CheckPolicies((ability: any) =>
        ability.can(Operation.Delete, 'RolePermission'),
    )
    async disableRolePermission(@Param('roleId', ParseIntPipe) roleId: number) {
        const response = await this.rolePermissionService.disableRole(roleId);
        return {
            status: HttpStatus.ACCEPTED,
            data: response,
        };
    }

    @Patch('enableRolePermission/:roleId')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    @ApiParam({ name: 'roleId', type: Number })
    @CheckPolicies((ability: any) =>
        ability.can(Operation.Update, 'RolePermission'),
    )
    async enableRolePermission(@Param('roleId', ParseIntPipe) roleId: number) {
        const response = await this.rolePermissionService.enableRole(roleId);
        return {
            status: HttpStatus.ACCEPTED,
            data: response,
        };
    }
}
