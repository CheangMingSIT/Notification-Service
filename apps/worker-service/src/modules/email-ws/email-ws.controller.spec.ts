import { Test, TestingModule } from '@nestjs/testing';
import { EmailWsController } from './email-ws.controller';

describe('EmailWsController', () => {
    let controller: EmailWsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EmailWsController],
        }).compile();

        controller = module.get<EmailWsController>(EmailWsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
