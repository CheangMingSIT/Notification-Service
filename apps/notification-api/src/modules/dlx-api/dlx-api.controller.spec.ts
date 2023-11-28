import { Test, TestingModule } from '@nestjs/testing';
import { DlxApiController } from './dlx-api.controller';

describe('DlxApiController', () => {
  let controller: DlxApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DlxApiController],
    }).compile();

    controller = module.get<DlxApiController>(DlxApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
