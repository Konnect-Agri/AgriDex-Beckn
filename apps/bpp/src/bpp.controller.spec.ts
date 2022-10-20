import { Test, TestingModule } from '@nestjs/testing';
import { BppController } from './bpp.controller';
import { BppService } from './bpp.service';

describe('BppController', () => {
  let bppController: BppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BppController],
      providers: [BppService],
    }).compile();

    bppController = app.get<BppController>(BppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(bppController.getHello()).toBe('Hello World!');
    });
  });
});
