import { Test, TestingModule } from '@nestjs/testing';
import { OnSelectController } from './on-select.controller';

describe('OnSelectController', () => {
  let controller: OnSelectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnSelectController],
    }).compile();

    controller = module.get<OnSelectController>(OnSelectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
