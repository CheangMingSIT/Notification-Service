import {
    CallHandler,
    ExecutionContext,
    NestInterceptor,
    UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ClassConstructor {
    new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
    // a decorator that can be applied in a controller method
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) {}

    intercept(
        context: ExecutionContext,
        handler: CallHandler,
    ): Observable<any> {
        return handler.handle().pipe(
            // handler.handle() invoke the controller method and obtain the response
            map((data: any) => {
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true, // excludeExtraneousValues: true will remove any properties that are not defined in the dto
                });
            }),
        );
    }
}
