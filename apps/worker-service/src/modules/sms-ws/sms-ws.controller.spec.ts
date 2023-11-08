import { Test, TestingModule } from '@nestjs/testing';
import { SmsWsController } from './sms-ws.controller';

describe('SmsWsController', () => {
  let controller: SmsWsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmsWsController],
    }).compile();

    controller = module.get<SmsWsController>(SmsWsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
