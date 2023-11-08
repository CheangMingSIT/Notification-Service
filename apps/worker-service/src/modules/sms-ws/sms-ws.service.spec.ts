import { Test, TestingModule } from '@nestjs/testing';
import { SmsWsService } from './sms-ws.service';

describe('SmsWsService', () => {
  let service: SmsWsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmsWsService],
    }).compile();

    service = module.get<SmsWsService>(SmsWsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
