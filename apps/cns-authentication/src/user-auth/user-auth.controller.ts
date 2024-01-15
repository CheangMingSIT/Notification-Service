import {
    JwtAuthGuard,
    RefreshTokenGuard,
    ResetPasswordGuard,
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
    Get,
    Post,
    Request,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { loginDto } from './dtos/login.dto';
import { ResetPassword } from './dtos/reset-password.dto';
import { UserExposeDto } from './dtos/user-expose.dto';
import { UserDto } from './dtos/user.dto';
import { UserAuthService } from './user-auth.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiTags('Authentications')
export class UserAuthController {
    constructor(private authService: UserAuthService) {}

    @Post('signIn')
    @ApiBody({ type: loginDto })
    @UseGuards(UserAuthGuard)
    signIn(@Request() req: any) {
        return this.authService.signIn(req.user);
    }

    @Post('signUp')
    @Serialize(UserExposeDto)
    @UseFilters(HttpExceptionFilter)
    signUp(@Body() body: UserDto) {
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

    @Post('forgotPassword')
    forgotPassword(@Body() body: ForgotPasswordDto) {
        return this.authService.requestPasswordResetLink(body.email);
    }

    @Post('resetPassword')
    @ApiQuery({ name: 'token', type: String })
    @UseGuards(ResetPasswordGuard)
    resetPassword(@Request() req: any, @Body() body: ResetPassword) {
        return this.authService.resetPassword(req.user, body.password);
    }
}
