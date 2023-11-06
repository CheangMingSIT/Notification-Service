import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkerServiceService {
  getHello(): string {
    return 'WORKER SERVICE!';
  }
}
