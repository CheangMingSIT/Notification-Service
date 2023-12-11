import { postgresConfigAsync } from '@app/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forRootAsync(postgresConfigAsync)],
    exports: [PostgresDBModule],
})
export class PostgresDBModule {}
