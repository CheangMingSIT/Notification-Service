import { Controller } from '@nestjs/common';
import { WorkerServiceService } from './worker-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class WorkerServiceController {
  constructor(private readonly workerServiceService: WorkerServiceService) {}

  @EventPattern('notification.email')
  getEmail(@Payload() message: string) {
    console.log(message);
  }
}
