import {
    Actions,
    AppAbility,
    CheckPolicies,
    JwtAuthGuard,
    PolicyGuard,
} from '@app/auth';
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
    Query,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
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
    listUsers(@Query() query: PaginationDto) {
        return this.userService.listUsers(query);
    }

    @Patch('updateUser/:userId')
    @ApiBearerAuth()
    @ApiBody({ type: UserRoleIdDto })
    @ApiParam({ name: 'userId', type: String })
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Actions.Update, 'User'))
    @UseFilters(HttpExceptionFilter)
    updateUser(@Param('userId') userId: string, @Body() roleId: UserRoleIdDto) {
        return this.userService.updateUser(userId, roleId);
    }

    @Delete('deleteUser/:userId')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Actions.Delete, 'User'))
    @UseFilters(HttpExceptionFilter)
    deleteUser(@Param('userId') userId: string) {
        return this.userService.deleteUser(userId);
    }
}
