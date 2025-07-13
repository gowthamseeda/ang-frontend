import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs/internal/Observable';
import { ApiError } from '../../../shared/services/api/api.service';
import { ServiceVariantMock } from '../service-variant.mock';
import { ServiceVariantApiActions, ServiceVariantServiceActions } from './actions';
import { ServiceVariantDataService } from './service-variant-data.service';
import { ServiceVariantEffects } from './service-variant.effects';
import { provideMockActions } from '@ngrx/effects/testing';

describe('Service Variant Effects', () => {
  let effects: ServiceVariantEffects;
  let serviceVariantDataService: ServiceVariantDataService;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServiceVariantEffects,
        provideMockActions(() => actions),
        {
          provide: ServiceVariantDataService,
          useValue: {
            getAllForServiceByBusinessSiteId: jest.fn()
          }
        }
      ]
    });

    effects = TestBed.inject(ServiceVariantEffects);
    serviceVariantDataService = TestBed.inject(ServiceVariantDataService);
    actions = TestBed.inject(Actions);
  });

  describe('loadServiceVariants', () => {
    it('should dispatch a serviceVariantApiActions.loadServiceVariantsSuccess action', () => {
      const serviceVariants = ServiceVariantMock.asList();
      const action = ServiceVariantServiceActions.loadServiceVariants({
        outletId: ''
      });
      const completion = ServiceVariantApiActions.loadServiceVariantsSuccess({ serviceVariants });

      actions = hot('-a', { a: action });
      const response = cold('-a|', { a: serviceVariants });
      const expected = cold('--b', { b: completion });

      jest.spyOn(serviceVariantDataService, 'getAllForServiceByBusinessSiteId').mockReturnValue(
        response
      );
      expect(effects.loadServiceVariants).toBeObservable(expected);
    });

    it('should dispatch a serviceVariantApiActions.loadServiceVariantsError action', () => {
      const error = { message: 'GENERAL_API_ERROR' } as ApiError;

      const action = ServiceVariantServiceActions.loadServiceVariants({
        outletId: ''
      });
      const completion = ServiceVariantApiActions.loadServiceVariantsError({ error });

      actions = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: completion });

      jest.spyOn(serviceVariantDataService, 'getAllForServiceByBusinessSiteId').mockReturnValue(
        response
      );
      expect(effects.loadServiceVariants).toBeObservable(expected);
    });
  });
});
