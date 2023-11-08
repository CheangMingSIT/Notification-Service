import { Test, TestingModule } from '@nestjs/testing';
import { SmsApiController } from './sms-api.controller';

describe('SmsApiController', () => {
  let controller: SmsApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmsApiController],
    }).compile();

    controller = module.get<SmsApiController>(SmsApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
