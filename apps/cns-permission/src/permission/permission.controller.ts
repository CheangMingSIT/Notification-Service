import { JwtAuthGuard } from '@app/auth';
import {
    HttpExceptionFilter,
    NOTIFICATIONSYSTEM,
    PaginationDto,
} from '@app/common';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { PermissionIdDto } from './dtos/permissionId.dto';
import { PermissionDto } from './dtos/permssion.dto';
import { PermissionService } from './permission.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiBearerAuth()
@ApiTags('Permissions')
export class PermissionController {
    constructor(private permissionService: PermissionService) {}

    @Get('listPermissions')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    listPermissions(@Query() query: PaginationDto): Promise<any> {
        return this.permissionService.listPermissions(query);
    }

    @Post('createPermission')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    createPermission(@Body() body: PermissionDto) {
        return this.permissionService.createPermission(body);
    }

    @Patch('updatePermission/:permissionId')
    @ApiParam({ name: 'permissionId', type: PermissionIdDto })
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    updatePermission(
        @Param('permissionId') permission: PermissionIdDto,
        @Body() body: PermissionDto,
    ) {
        return this.permissionService.updatePermission(
            permission.permissionId,
            body,
        );
    }

    @Delete('deletePermission/:permissionId')
    @ApiParam({ name: 'permissionId', type: PermissionIdDto })
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    deletePermission(@Param('permissionId') permissionId: number) {
        return this.permissionService.deletePermission(permissionId);
    }
}
