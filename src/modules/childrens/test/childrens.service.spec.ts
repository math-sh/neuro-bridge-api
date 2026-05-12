import { Test, TestingModule } from '@nestjs/testing';
import { ChildrensService } from './childrens.service';

describe('ChildrensService', () => {
  let service: ChildrensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChildrensService],
    }).compile();

    service = module.get<ChildrensService>(ChildrensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
