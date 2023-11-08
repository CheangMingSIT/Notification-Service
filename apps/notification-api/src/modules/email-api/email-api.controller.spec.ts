import { Test, TestingModule } from '@nestjs/testing';
import { EmailApiController } from './email-api.controller';

describe('EmailApiController', () => {
  let controller: EmailApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailApiController],
    }).compile();

    controller = module.get<EmailApiController>(EmailApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
