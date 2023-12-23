import {
    Actions,
    AppAbility,
    CheckPolicies,
    JwtAuthGuard,
    PolicyGuard,
} from '@app/auth';
import { NOTIFICATIONSYSTEM } from '@app/common';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiKeyService } from './api-key.service';
import { GenerateTokenDto } from './dtos/generate-token.dto';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiBearerAuth()
@ApiTags('Api Auth')
export class ApiKeyController {
    constructor(private apiKeyService: ApiKeyService) {}

    @Post('generateApiKey')
    @ApiBody({ type: GenerateTokenDto })
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Actions.Create, 'ApiKey'),
    )
    async generateToken(@Body() body: GenerateTokenDto) {
        const response = await this.apiKeyService.generateApiKey(body.name);
        return response;
    }

    @Get('apiKeyRecords')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Actions.Read, 'ApiKey'))
    async listApiKeys() {
        const response = await this.apiKeyService.listApiKeys();
        return response;
    }
}
