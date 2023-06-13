import { Test, TestingModule } from '@nestjs/testing';
import { TrackController } from './cancel.controller';

describe('TrackController', () => {
  let controller: TrackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackController],
    }).compile();

    controller = module.get<TrackController>(TrackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
