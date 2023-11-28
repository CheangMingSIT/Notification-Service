import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    MongooseModuleAsyncOptions,
    MongooseModuleOptions,
} from '@nestjs/mongoose';

export default class MongooseConfig {
    static getMongooseConfig(
        configService: ConfigService,
    ): MongooseModuleOptions {
        return {
            uri: configService.get('MONGODB_URI'),
        };
    }
}

export const mongooseConfigAsync: MongooseModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (
        configService: ConfigService,
    ): Promise<MongooseModuleOptions> =>
        MongooseConfig.getMongooseConfig(configService),
    inject: [ConfigService],
};
