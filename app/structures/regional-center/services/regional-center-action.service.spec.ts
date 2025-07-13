import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';

import { StructuresState } from '../../store';
import { RegionalCenterActions } from '../store/actions';

import { RegionalCenterActionService } from './regional-center-action.service';

describe('regional center action service test suite', () => {
  let regionalCenterActionService: RegionalCenterActionService;
  let store: MockStore<StructuresState>;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        RegionalCenterActionService,
        provideMockStore(),
        provideMockActions(() => actions)
      ]
    });
    regionalCenterActionService = TestBed.inject(RegionalCenterActionService);
    store = TestBed.inject(MockStore);
    actions = TestBed.inject(Actions);
    jest.spyOn(store, 'dispatch');
  });

  test('should be created', () => {
    expect(regionalCenterActionService).toBeTruthy();
  });

  test('dispatch loadRegionalCenters', () => {
    const expectedAction = RegionalCenterActions.loadRegionalCenters();
    regionalCenterActionService.dispatchLoadRegionalCenters();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
