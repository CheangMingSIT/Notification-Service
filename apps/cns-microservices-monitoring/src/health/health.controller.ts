import { Controller, Get } from '@nestjs/common';
import { InjectConnection as InjectMongoConnection } from '@nestjs/mongoose';
import {
    HealthCheck,
    HealthCheckService,
    HttpHealthIndicator,
    MongooseHealthIndicator,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection as MongooseConnection } from 'mongoose';
import { Connection as TypeOrmConnection } from 'typeorm';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private mongoose: MongooseHealthIndicator,
        private typeorm: TypeOrmHealthIndicator,
        @InjectMongoConnection() private mongoDb: MongooseConnection,
        @InjectConnection('postgres') private postgresDb: TypeOrmConnection,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () =>
                this.http.pingCheck(
                    'notification-record',
                    'http://localhost:3050/cns-notification-record',
                ),
            () =>
                this.http.pingCheck(
                    'authentication',
                    'http://localhost:3060/cns-auth',
                ),
            () => this.http.pingCheck('user', 'http://localhost:3070/cns-user'),
            () =>
                this.http.pingCheck(
                    'apiKey',
                    'http://localhost:3080/cns-apiKey',
                ),
            () =>
                this.typeorm.pingCheck('postgres', {
                    connection: this.postgresDb,
                }),
            () =>
                this.mongoose.pingCheck('mongodb', {
                    connection: this.mongoDb,
                }),
        ]);
    }
}
