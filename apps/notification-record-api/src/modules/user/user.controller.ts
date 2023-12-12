import { JwtAuthGuard, UserAuthGuard } from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONAPI, Serialize } from '@app/common';
import {
    Body,
    Controller,
    Post,
    Request,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { UserDeleteDto } from './dtos/user-delete.dto';
import { userRegistrationDto } from './dtos/user-registration.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller(NOTIFICATIONAPI)
export class UserController {
    constructor(private userService: UserService) {}

    @Post('signIn')
    @UseGuards(UserAuthGuard)
    signIn(@Request() req: any) {
        return this.userService.signIn(req.user);
    }

    @Post('signUp')
    @Serialize(UserDto)
    @UseFilters(HttpExceptionFilter)
    signUp(@Body() body: userRegistrationDto) {
        return this.userService.signUp(body);
    }

    @Post('updateUser')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    updateUser(@Body() body: { roleId: number; email: string }) {
        return this.userService.updateUser(body);
    }

    @Post('deleteUser')
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    deleteUser(@Body() body: UserDeleteDto) {
        return this.userService.deleteUser(body);
    }
}
