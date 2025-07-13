import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Spy, createSpyFromClass } from 'jest-auto-spies';
import { Observable, of } from 'rxjs';

import { UserService } from '../../../../iam/user/user.service';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';
import { OfferedServiceMock } from '../../../offered-service/offered-service.mock';
import { OfferedService } from '../../../offered-service/offered-service.model';
import { OfferedServiceServiceActions } from '../../../offered-service/store/actions';
import { servicesState } from '../../../store/index';
import { ServiceFilterCriteria } from '../../models/service-table-row.model';
import { MultiSelectDataService } from '../../services/multi-select-service-data.service';
import { ServiceTableFilterService } from '../../services/service-table-filter.service';
import { ServiceTableService } from '../../services/service-table.service';

import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { ServiceTableComponent } from './service-table.component';

class MockServiceTableFilterService {
  get pristine(): Observable<boolean> {
    return of(true);
  }

  get filterCriteria(): Observable<ServiceFilterCriteria> {
    return of({
      isOfferedService: {
        value: true,
        isEnabled: false
      }
    });
  }

  get pristineFilterCriteria(): Observable<ServiceFilterCriteria> {
    return of({
      isOfferedService: {
        value: true,
        isEnabled: false
      }
    });
  }
}

describe('ServiceTableComponent', () => {
  const offeredServices = OfferedServiceMock.asList();

  let userServiceSpy: Spy<UserService>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  let multiSelectDataServiceSpy: Spy<MultiSelectDataService>;
  let store: MockStore<servicesState.State>;
  let component: ServiceTableComponent;
  let fixture: ComponentFixture<ServiceTableComponent>;
  let offeredServiceServiceSpy: Spy<OfferedServiceService>;

  const serviceTableServiceStub = {
    serviceTableRows: of([]),
    isDataLoading: () => of(false),
    initPageIndex: () => of(0)
  };
  beforeEach(() => {
    userServiceSpy = createSpyFromClass(UserService);
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
    multiSelectDataServiceSpy = createSpyFromClass(MultiSelectDataService);
    offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
    userServiceSpy.getCountryRestrictions.nextWith(['DE']);
    userSettingsServiceSpy.getLanguageId.nextWith('de-DE');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [ServiceTableComponent, TranslatePipeMock],
      providers: [
        provideMockStore(),
        {
          provide: ServiceTableService,
          useValue: serviceTableServiceStub
        },
        { provide: UserService, useValue: userServiceSpy },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy },
        { provide: ServiceTableFilterService, useClass: MockServiceTableFilterService },
        { provide: MultiSelectDataService, useValue: multiSelectDataServiceSpy },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy },
        { provide: OfferedServiceService, useValue: offeredServiceServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    });

    TestBed.inject(ServiceTableFilterService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTableComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addOfferedService()', () => {
    it('should dispatch a offeredServiceServiceActions.addOfferedService on click', () => {
      const offeredService: OfferedService = offeredServices[0];
      const action = OfferedServiceServiceActions.addOfferedService({ offeredService });

      component.addOfferedService(offeredService);
      jest
        .spyOn(offeredServiceServiceSpy, 'add')
        .mockReturnValue(
          store.dispatch(OfferedServiceServiceActions.addOfferedService({ offeredService }))
        );

      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('removeOfferedService()', () => {
    it('should dispatch a offeredServiceServiceActions.removeOfferedService on click', () => {
      const offeredService: OfferedService = offeredServices[0];
      const id = offeredService.id;
      const action = OfferedServiceServiceActions.removeOfferedService({ id });

      jest.spyOn(offeredServiceServiceSpy, 'get').mockReturnValue(of(offeredService));
      jest
        .spyOn(offeredServiceServiceSpy, 'remove')
        .mockReturnValue(store.dispatch(OfferedServiceServiceActions.removeOfferedService({ id })));

      component.removeOfferedService(id);
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
});
