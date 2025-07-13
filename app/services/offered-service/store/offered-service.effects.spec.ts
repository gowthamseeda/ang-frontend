import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ApiError } from 'app/shared/services/api/api.service';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { servicesState } from '../../store';
import { OfferedServiceMock } from '../offered-service.mock';

import { OfferedServiceApiActions, OfferedServiceServiceActions } from './actions';
import { OfferedServiceDataService } from './offered-service-data.service';
import { OfferedServiceEffects } from './offered-service.effects';
import { offeredServiceSelectors } from './selectors/offered-service.selectors';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { sisterOutletMock , offeredServicesMock} from '../../shared/models/sister-outlet.mock';

describe('Offered Service Effects', () => {
  let snackBarServiceSpy: Spy<SnackBarService>;

  let effects: OfferedServiceEffects;
  let store: MockStore<servicesState.State>;
  let offeredServiceDataService: OfferedServiceDataService;
  let actions: Observable<any>;

  beforeEach(() => {
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        OfferedServiceEffects,
        provideMockStore(),
        provideMockActions(() => actions),
        {
          provide: OfferedServiceDataService,
          useValue: {
            get: jest.fn(),
            update: jest.fn(),
            querySisterOutlet: jest.fn()
          }
        },
        {
          provide: SnackBarService,
          useValue: snackBarServiceSpy
        }
      ]
    });

    effects = TestBed.inject(OfferedServiceEffects);
    store = TestBed.inject(MockStore);
    store.overrideSelector(offeredServiceSelectors.selectAll, []);
    offeredServiceDataService = TestBed.inject(OfferedServiceDataService);
    actions = TestBed.inject(Actions);
  });

  describe('loadOfferedServices', () => {
    it('should return a service.loadOfferedServicesSuccess', () => {
      const offeredServices = OfferedServiceMock.asList();

      const action = OfferedServiceServiceActions.loadOfferedServices({ outletId: 'GS00000001' });
      const completion = OfferedServiceApiActions.loadOfferedServicesSuccess({ offeredServices });

      actions = hot('-a', { a: action });
      const response = cold('-a|', { a: offeredServices });
      const expected = cold('--b', { b: completion });

      jest.spyOn(offeredServiceDataService, 'get').mockReturnValue(response);
      expect(effects.loadOfferedServices).toBeObservable(expected);
    });

    it('should return a service.loadOfferedServicesError if the serviceService throws', () => {
      const error = { message: 'GENERAL_API_ERROR' } as ApiError;

      const action = OfferedServiceServiceActions.loadOfferedServices({ outletId: 'GS00000001' });
      const completion = OfferedServiceApiActions.loadOfferedServicesError({ error });

      actions = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: completion });

      jest.spyOn(offeredServiceDataService, 'get').mockReturnValue(response);
      expect(effects.loadOfferedServices).toBeObservable(expected);
    });
  });

  it('should return a service.queryCompanySisterOutletSuccess', () => {
    const action = OfferedServiceServiceActions.queryCompanySisterOutlet({
      companyId: 'GC00000001',
      serviceIds: [120]
    });
    const mockResponse = {
      sisterOutlets: sisterOutletMock.sisterOutlets,
      offeredServices: offeredServicesMock
    };

    const completion = OfferedServiceApiActions.queryCompanySisterOutletSuccess(mockResponse);

    actions = hot('-a', { a: action });
    const response = cold('-a|', { a: mockResponse });
    const expected = cold('--b', { b: completion });

    jest.spyOn(offeredServiceDataService, 'querySisterOutlet').mockReturnValue(response);
    expect(effects.querySisterOutletForCompany).toBeObservable(expected);
  });
});
