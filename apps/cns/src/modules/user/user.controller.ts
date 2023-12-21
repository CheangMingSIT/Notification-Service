import {
    Actions,
    AppAbility,
    CheckPolicies,
    JwtAuthGuard,
    PolicyGuard,
} from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserDeleteDto } from './dtos/user-delete.dto';
import { UserUpdateDto } from './dtos/user-role-update.dto';
import { UserService } from './user.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiTags('Users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('updateUser')
    @ApiBody({ type: UserUpdateDto })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Actions.Update, 'User'))
    @UseFilters(HttpExceptionFilter)
    updateUser(@Body() body: UserUpdateDto) {
        return this.userService.updateUser(body);
    }

    @Post('deleteUser')
    @ApiBody({ type: UserDeleteDto })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Actions.Delete, 'User'))
    @UseFilters(HttpExceptionFilter)
    deleteUser(@Body() body: UserDeleteDto) {
        return this.userService.deleteUser(body);
    }
}
