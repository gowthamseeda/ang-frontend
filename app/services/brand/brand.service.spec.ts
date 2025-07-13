import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { getUserMock } from '../../iam/user/user.mock';
import { UserService } from '../../iam/user/user.service';
import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../store/app-store.module';
import { TestingModule } from '../../testing/testing.module';

import { BrandMock } from './brand.mock';
import { BrandService } from './brand.service';

describe('BrandService', () => {
  const userDataRestrictionMock = getUserMock().dataRestrictions;
  const brandsMock = BrandMock.asList();

  let service: BrandService;
  let userServiceSpy: Spy<UserService>;

  beforeEach(() => {
    userServiceSpy = createSpyFromClass(UserService);
    userServiceSpy.getUserDataRestrictions.nextWith(userDataRestrictionMock);

    TestBed.configureTestingModule({
      imports: [TestingModule, AppStoreModule],
      providers: [
        BrandService,
        ApiService,
        LoggingService,
        { provide: UserService, useValue: userServiceSpy }
      ]
    });

    service = TestBed.inject(BrandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all brands from the services contract', done => {
      const expectedBrands = [brandsMock[0], brandsMock[3]];

      service.getAll().subscribe(brands => {
        expect(brands).toEqual(expectedBrands);
        done();
      });
    });
  });

  describe('getAllIds()', () => {
    it('should get all brands IDs from the services contract', done => {
      const expectedBrandIds = ['MB', 'FUSO'];

      service.getAllIds().subscribe(brandIds => {
        expect(brandIds).toEqual(expectedBrandIds);
        done();
      });
    });
  });

  describe('get()', () => {
    it('should get specific brand from the services contract', done => {
      const expectedBrand = brandsMock[0];

      service.get('MB').subscribe(brand => {
        expect(brand).toEqual(expectedBrand);
        done();
      });
    });
  });

  describe('getAllForUserDataRestrictions()', () => {
    it('should get all brands from the services contract filtered by current user data restriction', done => {
      const expectedBrands = [brandsMock[0]];

      service.getAllForUserDataRestrictions().subscribe(brands => {
        expect(brands).toEqual(expectedBrands);
        done();
      });
    });
  });

  describe('getFilteredBrands', () => {
    it('should not filter anything', () => {
      const filteredBrands = service.getFilteredBrands([], [], false);
      filteredBrands.subscribe(brands => {
        expect(brands).toEqual([brandsMock[0], brandsMock[3]]);
      });
    });

    it('should filter by user data restrictions and not exclude anything from the available brands set', () => {
      const filteredBrands = service.getFilteredBrands([], ['MB']);
      filteredBrands.subscribe(brands => {
        expect(brands.map(brand => brand.id)).toEqual(['MB']);
      });
    });

    it('should exclude brands from the available brands set', () => {
      const filteredBrands = service.getFilteredBrands(['MB'], ['MB', 'FUSO'], false);
      filteredBrands.subscribe(brands => {
        expect(brands.map(brand => brand.id)).toEqual(['FUSO']);
      });
    });
  });
});
