import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfigAsync } from '@app/config';

@Module({
    imports: [MongooseModule.forRootAsync(mongooseConfigAsync)],
    exports: [MongooseModule],
})
export class MongoDBModule {}
