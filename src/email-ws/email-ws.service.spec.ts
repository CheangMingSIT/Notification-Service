import { Test, TestingModule } from '@nestjs/testing';
import { EmailWsService } from './email-ws.service';

describe('EmailWsService', () => {
  let service: EmailWsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailWsService],
    }).compile();

    service = module.get<EmailWsService>(EmailWsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
