import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideAutoSpy, Spy } from 'jest-auto-spies';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { BusinessSiteTaskService } from '../../../tasks/shared/business-site-task.service';
import { getSingleOpeningHourMock } from '../../models/brand-product-group-opening-hours.mock';
import { Response } from '../../models/opening-hour-response.model';
import { BrandProductGroupOpeningHoursActions } from '../actions';

import { OpeningHoursTaskEffects } from './opening-hours-task.effects';
import { provideMockActions } from '@ngrx/effects/testing';

describe('OpeningHoursTaskEffects Test Suite', () => {
  let effects: OpeningHoursTaskEffects;
  let actions: Observable<any>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OpeningHoursTaskEffects,
        provideMockActions(() => actions),
        provideAutoSpy(UserAuthorizationService, { gettersToSpyOn: ['isAuthorizedFor'] }),
        provideAutoSpy(BusinessSiteTaskService)
      ]
    });

    effects = TestBed.inject<any>(OpeningHoursTaskEffects);
    actions = TestBed.inject<any>(Actions);
    userAuthorizationServiceSpy = TestBed.inject<any>(UserAuthorizationService);
    userAuthorizationServiceSpy.accessorSpies.getters.isAuthorizedFor.mockReturnThis();
    userAuthorizationServiceSpy.permissions.mockReturnThis();
    userAuthorizationServiceSpy.country.mockReturnThis();
    userAuthorizationServiceSpy.businessSite.mockReturnThis();
    businessSiteTaskServiceSpy = TestBed.inject<any>(BusinessSiteTaskService);
  });

  test('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('openingHoursLoadSuccess should', () => {
    const openingHoursResponse: Response = getSingleOpeningHourMock();
    const triggerAction = BrandProductGroupOpeningHoursActions.openingHoursLoadSuccess({
      response: openingHoursResponse
    });

    test('return loadTaskSuccess with undefined task data and without doing backend request if user is not authorized', () => {
      const authorizationResponse = cold('-b|', {
        b: false
      });
      userAuthorizationServiceSpy.verify.mockReturnValue(authorizationResponse);

      const taskServiceResponse = cold('-c|', {});
      businessSiteTaskServiceSpy.existsFor.mockReturnValue(taskServiceResponse);

      const expectedAction = BrandProductGroupOpeningHoursActions.loadTaskSuccess({});
      const expected = cold('--z', { z: expectedAction });

      actions = hot('-a', { a: triggerAction });

      expect(effects).toBeTruthy();
      expect(effects.loadOpeningHoursTask).toBeObservable(expected);
    });

    test('return loadTaskSuccess with task data if user is authorized', () => {
      const authorizationResponse = cold('-b|', {
        b: true
      });
      userAuthorizationServiceSpy.verify.mockReturnValue(authorizationResponse);

      const taskServiceResponse = cold('-c|', { c: true });
      businessSiteTaskServiceSpy.existsFor.mockReturnValue(taskServiceResponse);

      const expectedAction = BrandProductGroupOpeningHoursActions.loadTaskSuccess({
        dataChangeTaskPresent: true,
        verificationTaskPresent: true
      });
      const expected = cold('---z', { z: expectedAction });

      actions = hot('-a', { a: triggerAction });

      expect(effects).toBeTruthy();
      expect(effects.loadOpeningHoursTask).toBeObservable(expected);
    });

    test('return loadTaskSuccess with task data false if task api throw error', done => {
      const authorizationResponse = cold('-b|', {
        b: true
      });
      userAuthorizationServiceSpy.verify.mockReturnValue(authorizationResponse);

      businessSiteTaskServiceSpy.existsFor.throwWith({});

      actions = hot('-a', { a: triggerAction });

      expect(effects).toBeTruthy();

      effects.loadOpeningHoursTask.subscribe(result => {
        expect(result.dataChangeTaskPresent).toBeFalsy();
        expect(result.verificationTaskPresent).toBeFalsy();
      });
      done();
    });
  });
});
