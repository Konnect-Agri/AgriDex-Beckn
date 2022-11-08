import { Test, TestingModule } from '@nestjs/testing';
import { OnInitController } from './on-init.controller';

describe('OnInitController', () => {
  let controller: OnInitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnInitController],
    }).compile();

    controller = module.get<OnInitController>(OnInitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
