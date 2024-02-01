import {
    Actions,
    AppAbility,
    CheckPolicies,
    JwtAuthGuard,
    PolicyGuard,
} from '@app/auth';
import { NOTIFICATIONSYSTEM, PaginationDto } from '@app/common';
import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyService } from './api-key.service';
import { GenerateTokenDto } from './dtos/generate-token.dto';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiBearerAuth()
@ApiTags('Api Auth')
export class ApiKeyController {
    constructor(private apiKeyService: ApiKeyService) {}

    @Post('generateApiKey')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Actions.Create, 'ApiKey'),
    )
    async generateToken(
        @Body() body: GenerateTokenDto,
        @Request() req,
    ): Promise<{ status: number; token: any }> {
        const token = await this.apiKeyService.generateApiKey(
            body.name,
            req.user.userId,
        );
        return { status: HttpStatus.OK, token: token };
    }

    @Get('apiKeyRecords')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Actions.Read, 'ApiKey'))
    async listApiKeys(
        @Request() req,
        @Query() pagination: PaginationDto,
    ): Promise<{ status: number; response: object }> {
        const response = await this.apiKeyService.listApiKeys(
            req.user.userId,
            pagination,
        );
        return { status: HttpStatus.OK, response: response };
    }
}
