import { Test, TestingModule } from '@nestjs/testing';
import { DlxApiService } from './dlx-api.service';

describe('DlxApiService', () => {
  let service: DlxApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DlxApiService],
    }).compile();

    service = module.get<DlxApiService>(DlxApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
