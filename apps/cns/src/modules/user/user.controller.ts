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
    Param,
    Patch,
    Query,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dtos/pagination.dto';
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

    @Patch('updateUser/:uuid')
    @ApiBearerAuth()
    @ApiBody({ type: UserRoleIdDto })
    @ApiParam({ name: 'uuid', type: String })
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Actions.Update, 'User'))
    @UseFilters(HttpExceptionFilter)
    updateUser(@Param('uuid') uuid: string, @Body() roleId: UserRoleIdDto) {
        return this.userService.updateUser(uuid, roleId);
    }

    @Delete('deleteUser/:uuid')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Actions.Delete, 'User'))
    @UseFilters(HttpExceptionFilter)
    deleteUser(@Param('uuid') uuid: string) {
        return this.userService.deleteUser(uuid);
    }
}
