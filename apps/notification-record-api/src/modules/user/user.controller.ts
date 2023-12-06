import { NOTIFICATIONAPI, UserAuthGuard } from '@app/common';
import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';

@Controller(NOTIFICATIONAPI)
export class UserController {
    constructor(private userService: UserService) {}

    @Post('signIn')
    @UseGuards(UserAuthGuard)
    signIn(@Request() req: any) {
        return this.userService.signIn(req.user);
    }
}
