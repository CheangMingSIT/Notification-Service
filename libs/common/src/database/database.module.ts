import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfigAsync } from '@app/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync(mongooseConfigAsync),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule {}
