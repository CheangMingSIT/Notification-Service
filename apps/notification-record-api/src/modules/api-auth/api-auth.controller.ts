import {
    Actions,
    AppAbility,
    CheckPolicies,
    JwtAuthGuard,
    PolicyGuard,
} from '@app/auth';
import { NOTIFICATIONAPI } from '@app/common';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiAuthService } from './api-auth.service';
import { ApiAuthGuard } from './guard/api-auth.guard';

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
    @UseGuards(ApiAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Actions.Read, 'ApiKey'))
    async listApiKeys() {
        const response = await this.apiAuthService.listApiKeys();
        return response;
    }
}
