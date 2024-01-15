import { Module } from '@nestjs/common';
import { RolepermissionController } from './rolepermission.controller';
import { RolepermissionService } from './rolepermission.service';

@Module({
  controllers: [RolepermissionController],
  providers: [RolepermissionService]
})
export class RolepermissionModule {}
