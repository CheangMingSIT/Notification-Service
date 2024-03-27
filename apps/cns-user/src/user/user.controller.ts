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
    Query,
    Req,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { OrganisationAdminDto } from './dtos/user-admin.dto';
import { UserListDto } from './dtos/user-list.dto';
import { UserRoleIdDto } from './dtos/user-role-update.dto';
import { UserService } from './user.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiTags('Users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('listUsers')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @ApiBearerAuth()
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: AppAbility) => ability.can(Operation.Read, 'User'))
    async listUsers(@Query() query: UserListDto, @Req() req: any) {
        const response = await this.userService.listUsers(query, req.user);
        return {
            status: HttpStatus.OK,
            data: response,
        };
    }

    @Get('getUser/:userId')
    @ApiBearerAuth()
    @ApiParam({ name: 'userId', type: String })
    @UseGuards(JwtAuthGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Operation.Read, 'User'))
    @UseFilters(HttpExceptionFilter)
    async getUser(@Param('userId') userId: string) {
        const response = await this.userService.getUser(userId);
        return {
            status: HttpStatus.OK,
            data: response,
        };
    }

    @Patch('updateUser/:userId')
    @ApiBearerAuth()
    @ApiBody({ type: UserRoleIdDto })
    @ApiParam({ name: 'userId', type: String })
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Operation.Update, 'User'),
    )
    @UseFilters(HttpExceptionFilter)
    async updateUser(
        @Param('userId') userId: string,
        @Body() roleId: UserRoleIdDto,
    ) {
        const response = await this.userService.updateUser(userId, roleId);
        return {
            status: HttpStatus.OK,
            message: response,
        };
    }

    @Patch('enableUser/:userId')
    @ApiBearerAuth()
    @ApiParam({ name: 'userId', type: String })
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Operation.Update, 'User'),
    )
    @UseFilters(HttpExceptionFilter)
    async enableUser(@Param('userId') userId: string) {
        const response = await this.userService.enableUser(userId);
        return {
            status: HttpStatus.OK,
            message: response,
        };
    }

    @Patch('disableUser/:userId')
    @ApiBearerAuth()
    @ApiParam({ name: 'userId', type: String })
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Operation.Update, 'User'),
    )
    @UseFilters(HttpExceptionFilter)
    async disableUser(@Param('userId') userId: string) {
        const response = await this.userService.disableUser(userId);
        return {
            status: HttpStatus.OK,
            message: response,
        };
    }

    @Post('AdminOrganisationSetup')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Operation.Create, 'User'),
    )
    @UseFilters(HttpExceptionFilter)
    async AdminOrganisationSetup(@Body() body: OrganisationAdminDto) {
        const response = await this.userService.addAdminUser(body);
        return {
            status: HttpStatus.OK,
            message: response,
        };
    }
}
