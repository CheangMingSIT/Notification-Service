import {
    Actions,
    AppAbility,
    CheckPolicies,
    JwtAuthGuard,
    PolicyGuard,
} from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Query,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserListDto } from './dtos/user-list.dto';
import { UserRoleIdDto } from './dtos/user-role-update.dto';
import { UserService } from './user.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiTags('Users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('listUsers')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Actions.Read, 'User'))
    @UseFilters(HttpExceptionFilter)
    async listUsers(@Query() query: UserListDto) {
        const response = await this.userService.listUsers(query);
        return {
            status: HttpStatus.OK,
            data: response.data.users,
        };
    }

    @Get('getUser/:userId')
    @ApiBearerAuth()
    @ApiParam({ name: 'userId', type: String })
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Actions.Read, 'User'))
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
    @CheckPolicies((ability: AppAbility) => ability.can(Actions.Update, 'User'))
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

    @Delete('deleteUser/:userId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Actions.Delete, 'User'))
    @UseFilters(HttpExceptionFilter)
    async deleteUser(@Param('userId') userId: string) {
        const response = await this.userService.deleteUser(userId);
        return {
            status: HttpStatus.OK,
            message: response,
        };
    }

    @Patch('enableUser/:userId')
    @ApiBearerAuth()
    @ApiParam({ name: 'userId', type: String })
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Actions.Update, 'User'))
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
    @CheckPolicies((ability: AppAbility) => ability.can(Actions.Update, 'User'))
    @UseFilters(HttpExceptionFilter)
    async disableUser(@Param('userId') userId: string) {
        const response = await this.userService.disableUser(userId);
        return {
            status: HttpStatus.OK,
            message: response,
        };
    }
}
