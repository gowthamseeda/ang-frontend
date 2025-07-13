import { TestBed } from '@angular/core/testing';

import { RetailCountryService } from './retail-country.service';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { ApiService } from '../../shared/services/api/api.service';

describe('RetailCountryService', () => {
  let service: RetailCountryService;

  let apiServiceSpy: Spy<ApiService>

  beforeEach(() => {
    apiServiceSpy = createSpyFromClass(ApiService)

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ApiService,
          useValue: apiServiceSpy
        },
      ]
    });
    service = TestBed.inject(RetailCountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return retail country IDs', (done) => {
    const expectedIds: string[] = ['US', 'DE', 'FR'];

    apiServiceSpy.get.nextWith(expectedIds);

    service.getAllIds().subscribe({
      next: ids => {
        expect(ids).toEqual(expectedIds);
        expect(apiServiceSpy.get).toBeCalled();
        done();
      },
      error: done.fail
    });
  });
});
