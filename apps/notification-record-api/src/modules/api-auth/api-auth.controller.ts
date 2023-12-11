import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiAuthService } from './api-auth.service';
import { NOTIFICATIONAPI } from '@app/common';
import { JwtAuthGuard } from '@app/auth';
import { AppAbility, CheckPolicies, PolicyGuard, Actions } from '@app/auth';

@Controller(NOTIFICATIONAPI)
export class ApiAuthController {
    constructor(private apiAuthService: ApiAuthService) {}

    @Post('generateApiKey')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Actions.Create, 'ApiKey'),
    )
    async generateToken(@Body() body: { name: string }) {
        const response = await this.apiAuthService.generateApiKey(body.name);
        return response;
    }

    @Get('apiKeyRecords')
    @UseGuards(JwtAuthGuard)
    async listApiKeys() {
        const response = await this.apiAuthService.listApiKeys();
        return response;
    }
}
