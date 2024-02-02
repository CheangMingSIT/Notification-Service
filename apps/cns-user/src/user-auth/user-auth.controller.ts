import {
    JwtAuthGuard,
    RefreshTokenGuard,
    ResetPasswordGuard,
    UserAuthGuard,
} from '@app/auth';
import { HttpExceptionFilter, NOTIFICATIONSYSTEM } from '@app/common';
import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Patch,
    Post,
    Request,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { loginDto } from './dtos/login.dto';
import { ResetPassword } from './dtos/reset-password.dto';
import { UserDto } from './dtos/user.dto';
import { UserAuthService } from './user-auth.service';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiTags('Authentications')
export class UserAuthController {
    constructor(private authService: UserAuthService) {}

    @Post('signIn')
    @ApiBody({ type: loginDto })
    @UseGuards(UserAuthGuard)
    async signIn(@Request() req: any) {
        const token = await this.authService.signIn(req.user);
        return {
            status: HttpStatus.OK,
            token: token,
        };
    }

    @Post('signUp')
    @UseFilters(HttpExceptionFilter)
    async signUp(@Body() body: UserDto): Promise<object> {
        const response = await this.authService.signUp(body);
        return {
            status: HttpStatus.ACCEPTED,
            message: response,
        };
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('logout')
    async logout(@Request() req: any) {
        const response = await this.authService.logout(req.user['userId']);
        return {
            status: HttpStatus.OK,
            message: response,
        };
    }

    @UseGuards(RefreshTokenGuard)
    @ApiBearerAuth()
    @Get('refreshToken')
    async refreshToken(@Request() req: any) {
        const token = await this.authService.refreshToken(req.user);
        return {
            status: HttpStatus.OK,
            token: token,
        };
    }

    @Post('forgotPassword')
    async forgotPassword(@Body() body: ForgotPasswordDto) {
        const response = await this.authService.requestPasswordResetLink(
            body.email,
        );
        return {
            status: HttpStatus.OK,
            message: response,
        };
    }

    @Patch('resetPassword')
    @ApiQuery({ name: 'token', type: String })
    @UseGuards(ResetPasswordGuard)
    async resetPassword(@Request() req: any, @Body() body: ResetPassword) {
        const response = await this.authService.resetPassword(
            req.user,
            body.password,
        );
        return {
            status: HttpStatus.ACCEPTED,
            message: response,
        };
    }
}
