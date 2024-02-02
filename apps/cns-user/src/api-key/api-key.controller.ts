import {
    Actions,
    AppAbility,
    CheckPolicies,
    JwtAuthGuard,
    PolicyGuard,
} from '@app/auth';
import {
    HttpExceptionFilter,
    NOTIFICATIONSYSTEM,
    PaginationDto,
} from '@app/common';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Query,
    Request,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiKeyService } from './api-key.service';
import { GenerateTokenDto } from './dtos/generate-token.dto';

@Controller({ version: '1', path: NOTIFICATIONSYSTEM })
@ApiBearerAuth()
@ApiTags('Api Auth')
export class ApiKeyController {
    constructor(private apiKeyService: ApiKeyService) {}

    @Post('generateSecretKey')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Actions.Create, 'ApiKey'),
    )
    async generateToken(
        @Body() body: GenerateTokenDto,
        @Request() req,
    ): Promise<{ status: number; secretKey: string }> {
        const secretKey = await this.apiKeyService.generateApiKey(
            body.name,
            req.user.userId,
        );
        return { status: HttpStatus.OK, secretKey: secretKey.toString() };
    }

    @Get('apiKeyRecords')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @UseFilters(HttpExceptionFilter)
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

    @Delete('deleteApiKey/:secretKeyId')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @ApiParam({ name: 'secretKeyId', required: true, type: 'string' })
    @UseFilters(HttpExceptionFilter)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Actions.Delete, 'ApiKey'),
    )
    async deleteApiKey(
        @Request() req,
        @Param('secretKeyId') id: string,
    ): Promise<{ status: number; message: string }> {
        const response = await this.apiKeyService.deleteApiKey(
            req.user.userId,
            id,
        );
        return {
            status: HttpStatus.OK,
            message: response,
        };
    }
}
