import { Test, TestingModule } from '@nestjs/testing';
import { TestApiController } from './test-api.controller';
import { TestApiService } from './test-api.service';

describe('TestApiController', () => {
  let testApiController: TestApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TestApiController],
      providers: [TestApiService],
    }).compile();

    testApiController = app.get<TestApiController>(TestApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(testApiController.getHello()).toBe('Hello World!');
    });
  });
});
