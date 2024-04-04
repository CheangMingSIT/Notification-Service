import { CheckPolicies, JwtAuthGuard, Operation } from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { PermissionDto } from './dtos/permssion.dto';
import { PermissionService } from './permission.service';

interface resourceOperation {
    permissionId: number;
    operation: [string];
    resources: string;
}

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiBearerAuth()
@ApiTags('Permissions')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Get('listPermissions')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) => ability.can(Operation.Read, 'Permission'))
    async listPermissions(@Query() query: PermissionDto) {
        let response = await this.permissionService.listPermissions(query);

        return {
            status: HttpStatus.OK,
            data: response,
        };
    }

    @Get('groupPermissionsByResource')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) => ability.can(Operation.Read, 'Permission'))
    async groupPermissionsByResource() {
        let response =
            await this.permissionService.groupPermissionsByResource();
        return {
            status: HttpStatus.OK,
            data: response,
        };
    }

    @Post('createPermission')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) =>
        ability.can(Operation.Create, 'Permission'),
    )
    async createPermission(@Body() body: PermissionDto) {
        const response = await this.permissionService.createPermission(body);
        return {
            status: HttpStatus.CREATED,
            message: response,
        };
    }

    @Patch('updatePermission/:permissionId')
    @ApiParam({ name: 'permissionId', type: 'number' })
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: any) =>
        ability.can(Operation.Update, 'Permission'),
    )
    async updatePermission(
        @Param('permissionId') permission: number,
        @Body() body: PermissionDto,
    ) {
        const permissionId = Number(permission);
        const response = await this.permissionService.updatePermission(
            permissionId,
            body,
        );
        return {
            status: HttpStatus.OK,
            message: response,
        };
    }
}
