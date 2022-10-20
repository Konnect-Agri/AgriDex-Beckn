import { Test, TestingModule } from '@nestjs/testing';
import { BgController } from './bg.controller';
import { BgService } from './bg.service';

describe('BgController', () => {
  let bgController: BgController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BgController],
      providers: [BgService],
    }).compile();

    bgController = app.get<BgController>(BgController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(bgController.getHello()).toBe('Hello World!');
    });
  });
});
