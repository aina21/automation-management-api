import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentController } from './environment.controller';
import { EnvironmentService } from './environment.service';
import { EnvironmentModule } from './environment.module';

describe('EnvironmentController', () => {
  let controller: EnvironmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvironmentModule],
      controllers: [EnvironmentController],
      providers: [EnvironmentService],
    }).compile();

    controller = module.get<EnvironmentController>(EnvironmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
