import { Test, TestingModule } from '@nestjs/testing';
import { OnSearchController } from './search.controller';
import { OnSearchService } from './search.service';

describe('OnSearchController', () => {
  let controller: OnSearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnSearchController],
      providers: [OnSearchService],
    }).compile();

    controller = module.get<OnSearchController>(OnSearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
