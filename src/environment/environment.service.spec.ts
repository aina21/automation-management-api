import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {
  let environmentService: EnvironmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvironmentService],
    }).compile();

    environmentService = module.get<EnvironmentService>(EnvironmentService);
  });

  it('should be defined', () => {
    expect(environmentService).toBeDefined();
  });
});
