import { NOTIFICATIONAPI } from '@app/common';
import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UserAuthGuard } from '@app/auth';

@Controller(NOTIFICATIONAPI)
export class UserController {
    constructor(private userService: UserService) {}

    @Post('signIn')
    @UseGuards(UserAuthGuard)
    signIn(@Request() req: any) {
        return this.userService.signIn(req.user);
    }
}
