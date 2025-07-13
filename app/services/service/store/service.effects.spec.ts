import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { ApiError } from '../../../shared/services/api/api.service';
import { Service } from '../models/service.model';

import { ServiceApiActions, ServiceServiceActions } from './actions';
import { ServiceDataService } from './service-data.service';
import { ServiceEffects } from './service.effects';
import { provideMockActions } from '@ngrx/effects/testing';

describe('Service Effects', () => {
  let effects: ServiceEffects;
  let serviceDataService: ServiceDataService;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServiceEffects,
        provideMockActions(() => actions),
        {
          provide: ServiceDataService,
          useValue: {
            getAll: jest.fn(),
            get: jest.fn()
          }
        }
      ]
    });

    effects = TestBed.inject(ServiceEffects);
    serviceDataService = TestBed.inject(ServiceDataService);
    actions = TestBed.inject(Actions);
  });

  describe('loadServices', () => {
    it('should return a service.loadServicesSuccess', () => {
      const services: Service[] = [
        { id: 0, name: 'Sales', position: 0, active: true, openingHoursSupport: false },
        { id: 1, name: 'Parts', position: 1, active: true, openingHoursSupport: false }
      ];

      const action = ServiceServiceActions.loadServices();
      const completion = ServiceApiActions.loadServicesSuccess({ services });

      actions = hot('-a', { a: action });
      const response = cold('-a|', { a: services });
      const expected = cold('--b', { b: completion });

      jest.spyOn(serviceDataService, 'getAll').mockReturnValue(response);

      expect(effects.loadServices).toBeObservable(expected);
    });

    it('should return a service.loadServicesError if the serviceService throws', () => {
      const error = { message: 'GENERAL_API_ERROR' } as ApiError;

      const action = ServiceServiceActions.loadServices();
      const completion = ServiceApiActions.loadServicesError({ error });

      actions = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: completion });

      jest.spyOn(serviceDataService, 'getAll').mockReturnValue(response);

      expect(effects.loadServices).toBeObservable(expected);
    });
  });
  describe('loadService', () => {
    it('should return a service.loadServiceSuccess', () => {
      const service: Service = {
        id: 2,
        name: 'Sales',
        position: 0,
        active: true,
        openingHoursSupport: false
      };
      const action = ServiceServiceActions.loadService({ serviceId: 2 });
      const completion = ServiceApiActions.loadServiceSuccess({ service });

      actions = hot('-a', { a: action });
      const response = cold('-a|', { a: service });
      const expected = cold('--b', { b: completion });

      jest.spyOn(serviceDataService, 'get').mockReturnValue(response);

      expect(effects.loadService).toBeObservable(expected);
    });
    it('should return a service.loadServiceError if the serviceService throws', () => {
      const error = { message: 'GENERAL_API_ERROR' } as ApiError;

      const action = ServiceServiceActions.loadService({ serviceId: 2 });
      const completion = ServiceApiActions.loadServiceError({ error });

      actions = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: completion });

      jest.spyOn(serviceDataService, 'get').mockReturnValue(response);

      expect(effects.loadService).toBeObservable(expected);
    });
  });
});
