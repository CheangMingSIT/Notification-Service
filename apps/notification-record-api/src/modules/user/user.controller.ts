import { NOTIFICATIONAPI } from '@app/common';
import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard, UserAuthGuard } from '@app/auth';

@Controller(NOTIFICATIONAPI)
export class UserController {
    constructor(private userService: UserService) {}

    @Post('signIn')
    @UseGuards(UserAuthGuard)
    signIn(@Request() req: any) {
        return this.userService.signIn(req.user);
    }

    @Post('signUp')
    signUp(@Body() body: { username: string; password: string }) {
        return this.userService.signUp(body.username, body.password);
    }

    @Post('deleteUser')
    @UseGuards(JwtAuthGuard)
    deleteUser(@Body() body: { username: string }) {
        return this.userService.deleteUser(body.username);
    }
}
