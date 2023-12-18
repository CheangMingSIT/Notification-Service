import {
    Actions,
    AppAbility,
    CheckPolicies,
    JwtAuthGuard,
    PolicyGuard,
    UserAuthGuard,
} from '@app/auth';
import {
    HttpExceptionFilter,
    NOTIFICATIONSYSTEM,
    Serialize,
} from '@app/common';
import {
    Body,
    Controller,
    Post,
    Request,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserDeleteDto } from './dtos/user-delete.dto';
import { UserRegistrationDto } from './dtos/user-registration.dto';
import { UserUpdateDto } from './dtos/user-role-update.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiTags('User')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('signIn')
    @ApiBody({ type: UserRegistrationDto })
    @UseGuards(UserAuthGuard)
    signIn(@Request() req: any) {
        return this.userService.signIn(req.user);
    }

    @Post('signUp')
    @Serialize(UserDto)
    @UseFilters(HttpExceptionFilter)
    signUp(@Body() body: UserRegistrationDto) {
        return this.userService.signUp(body);
    }

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
