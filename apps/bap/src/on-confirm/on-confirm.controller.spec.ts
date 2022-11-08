import { Test, TestingModule } from '@nestjs/testing';
import { OnConfirmController } from './on-confirm.controller';

describe('OnConfirmController', () => {
  let controller: OnConfirmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnConfirmController],
    }).compile();

    controller = module.get<OnConfirmController>(OnConfirmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
