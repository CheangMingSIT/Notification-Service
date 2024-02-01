import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export default class postgresConfig {
    static getPostgresConfig(
        configService: ConfigService,
    ): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: configService.get('POSTGRES_HOST'),
            port: configService.get('POSTGRES_PORT'),
            username: configService.get('POSTGRES_USER'),
            password: configService.get('POSTGRES_PASSWORD'),
            database: configService.get('POSTGRES_DB'),
            url: configService.get('POSTGRES_URI'),
            autoLoadEntities: true,
            synchronize: true,
        };
    }
}

export const postgresConfigAsync: TypeOrmModuleAsyncOptions = {
    name: 'postgres',
    imports: [ConfigModule],
    useFactory: async (
        configService: ConfigService,
    ): Promise<TypeOrmModuleOptions> =>
        postgresConfig.getPostgresConfig(configService),
    inject: [ConfigService],
};
