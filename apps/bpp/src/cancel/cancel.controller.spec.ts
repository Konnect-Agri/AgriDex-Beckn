/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CancelController } from './cancel.controller';

describe('CancelController', () => {
  let controller: CancelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CancelController],
    }).compile();

    controller = module.get<CancelController>(CancelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
