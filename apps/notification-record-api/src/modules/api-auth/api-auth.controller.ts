import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiAuthService } from './api-auth.service';
import { NOTIFICATIONAPI, JwtAuthGuard } from '@app/common';

@Controller(NOTIFICATIONAPI)
export class ApiAuthController {
    constructor(private apiAuthService: ApiAuthService) {}
    @Post('generateApiKey')
    @UseGuards(JwtAuthGuard)
    async generateToken(@Body() body: { name: string }) {
        const response = await this.apiAuthService.generateApiKey(body.name);
        return response;
    }
}
