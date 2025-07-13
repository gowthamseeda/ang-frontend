import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { BrandCode } from '../../../../traits/shared/brand-code/brand-code.model';
import { BrandCodeService } from '../../../../traits/shared/brand-code/brand-code.service';
import { BrandsActions } from '../actions';

import { BrandsEffects } from './brands.effects';

describe('Brands Effects Test Suite', () => {
  let effects: BrandsEffects;
  let actions: Observable<any>;
  let brandCodeService: BrandCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BrandsEffects,
        provideMockActions(() => actions),
        {
          provide: BrandCodeService,
          useValue: {
            get: jest.fn()
          }
        }
      ]
    });

    actions = TestBed.inject(Actions);
    effects = TestBed.inject(BrandsEffects);
    brandCodeService = TestBed.inject(BrandCodeService);
  });

  describe('loadBrands action should', () => {
    const brandId = 'MB';
    const brandCodes: BrandCode[] = [{ brandId: brandId, brandCode: '123456' }];
    const brandIds: string[] = [brandId];

    test('dispatch loadBrandsSuccess action', () => {
      const triggerAction = BrandsActions.loadBrands({ outletId: 'any_Id' });
      actions = hot('-a', { a: triggerAction });

      const brandsResponse = cold('-b|', { b: brandCodes });
      jest.spyOn(brandCodeService, 'get').mockReturnValue(brandsResponse);

      const loadBrandsSuccess = BrandsActions.loadBrandsSuccess({
        brandIds: brandIds
      });
      const expected = cold('--c', { c: loadBrandsSuccess });

      expect(effects.loadBrands).toBeObservable(expected);
    });

    test('dispatch loadBrandsFailure action if load failed', () => {
      const triggerAction = BrandsActions.loadBrands({ outletId: 'any_Id' });
      actions = hot('-a', { a: triggerAction });

      const error = new Error('some error') as any;
      const brandsResponse = cold('-#|', {}, error);
      jest.spyOn(brandCodeService, 'get').mockReturnValue(brandsResponse);

      const loadBrandsFailure = BrandsActions.loadBrandsFailure({
        error: error
      });
      const expected = cold('--b', { b: loadBrandsFailure });

      expect(effects.loadBrands).toBeObservable(expected);
    });
  });
});
