import { JwtAuthGuard, RefreshTokenGuard, UserAuthGuard } from '@app/auth';
import {
    HttpExceptionFilter,
    NOTIFICATIONSYSTEM,
    Serialize,
} from '@app/common';
import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserExposeDto } from './dtos/user-expose.dto';
import { userDto } from './dtos/user.dto';
import { UserAuthService } from './user-auth.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiTags('Authentications')
export class UserAuthController {
    constructor(private authService: UserAuthService) {}

    @Post('signIn')
    @ApiBody({ type: userDto })
    @UseGuards(UserAuthGuard)
    signIn(@Request() req: any) {
        return this.authService.signIn(req.user);
    }

    @Post('signUp')
    @Serialize(UserExposeDto)
    @UseFilters(HttpExceptionFilter)
    signUp(@Body() body: userDto) {
        return this.authService.signUp(body);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('logout')
    logout(@Request() req: any) {
        return this.authService.logout(req.user['uuid']);
    }

    @UseGuards(RefreshTokenGuard)
    @ApiBearerAuth()
    @Get('refreshToken')
    refreshToken(@Request() req: any) {
        return this.authService.refreshToken(req.user);
    }
}
