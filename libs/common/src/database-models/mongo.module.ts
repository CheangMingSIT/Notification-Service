import { mongooseConfigAsync } from '@app/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forRootAsync(mongooseConfigAsync)],
    exports: [MongooseModule],
})
export class MongoDBModule {}
