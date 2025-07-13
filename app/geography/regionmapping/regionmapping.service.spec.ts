import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { TestingModule } from '../../testing/testing.module';
import { RegionMappingService } from './regionmapping.service';
import { getRegionMappingMock } from './regionmapping.mock';
import { RegionMapping } from './regionmapping.model';

describe('RegionMappingService', () => {
  let service: RegionMappingService;
  let regionMappingServiceSpy: Spy<RegionMappingService>;

  beforeEach(() => {
    regionMappingServiceSpy = createSpyFromClass(RegionMappingService);

    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [{ provide: RegionMappingService, useValue: regionMappingServiceSpy }]
    });
    service = TestBed.inject(RegionMappingService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should return valid state and province level mapping', done => {
      regionMappingServiceSpy.get.nextWith(getRegionMappingMock());

      const mappingResult: RegionMapping = {
        id: 'DE',
        stateLevel: 1,
        provinceLevel: 2
      };

      service.get('DE').subscribe(mapping => {
        expect(mapping).toEqual(mappingResult);
        done();
      });
    });
  });
});
