import { Test, TestingModule } from '@nestjs/testing';
import { BapController } from './bap.controller';
import { BapService } from './bap.service';

describe('BapController', () => {
  let bapController: BapController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BapController],
      providers: [BapService],
    }).compile();

    bapController = app.get<BapController>(BapController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(bapController.getHello()).toBe('Hello World!');
    });
  });
});
