import { Test, TestingModule } from '@nestjs/testing';
import { OnUpdateController } from './on-update.controller';

describe('OnUpdateController', () => {
  let controller: OnUpdateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnUpdateController],
    }).compile();

    controller = module.get<OnUpdateController>(OnUpdateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
