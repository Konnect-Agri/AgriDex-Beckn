import { Test, TestingModule } from '@nestjs/testing';
import { OnTrackController } from './on-track.controller';

describe('OnTrackController', () => {
  let controller: OnTrackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnTrackController],
    }).compile();

    controller = module.get<OnTrackController>(OnTrackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
