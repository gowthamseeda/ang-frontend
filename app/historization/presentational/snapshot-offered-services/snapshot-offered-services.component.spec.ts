import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PipesModule } from '../../../shared/pipes/pipes.module';

import { TestingModule } from '../../../testing/testing.module';
import { SnapshotOfferedServicesComponent } from './snapshot-offered-services.component';

import {
  comparingOfferedServiceSnapshotEntriesMock,
  currentOfferedServiceSnapshotEntriesMock
} from '../../models/offeredService-history-snapshot.mock';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { FeatureToggleService } from "../../../shared/directives/feature-toggle/feature-toggle.service";

describe('SnapshotOfferedServicesComponent', () => {
  let component: SnapshotOfferedServicesComponent;
  let fixture: ComponentFixture<SnapshotOfferedServicesComponent>;
  let matDialogSpy: Spy<MatDialog>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;

  beforeEach(waitForAsync(() => {
    matDialogSpy = createSpyFromClass(MatDialog);
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);

    TestBed.configureTestingModule({
      declarations: [SnapshotOfferedServicesComponent],
      imports: [TestingModule, PipesModule],
      providers: [
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    featureToggleServiceSpy.isFeatureEnabled.nextWith(true);
    fixture = TestBed.createComponent(SnapshotOfferedServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.currentOfferedServices = currentOfferedServiceSnapshotEntriesMock;
    component.comparingOfferedServices = comparingOfferedServiceSnapshotEntriesMock;
  });

  function findCurrentOfferedServiceById(offeredServiceId: string) {
    return component.currentOfferedServices.find(
      offeredService => offeredService.offeredServiceId === offeredServiceId
    );
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true for isChanged method if API return offeredServiceId in the changes array', () => {
    spyOn(component, 'getChangeData').and.returnValue({
      changedField: 'offeredServiceId',
      userId: 'USER'
    });
    const result = component.isChanged(
      'offeredServiceId',
      findCurrentOfferedServiceById('GS0000001-226')!!
    );

    expect(result).toEqual(true);
  });

  it('should return userId if API return offeredServiceId and userId in the changes array', () => {
    spyOn(component, 'getChangeData').and.returnValue({
      changedField: 'offeredServiceId',
      userId: 'USER'
    });
    const result = component.getChangeEditor(
      'offeredServiceId',
      findCurrentOfferedServiceById('GS0000001-226')!!
    );

    expect(result).toEqual('USER');
  });

  it('should return true if current offeredService series id has changed', () => {
    const result = component.isArrayFieldChangedFromComparingData(
      'series',
      { id: 3 },
      findCurrentOfferedServiceById('GS0000001-225')
    );

    expect(result).toEqual(true);
  });

  it('should return false if current offeredService series id has not changed', () => {
    const result = component.isArrayFieldChangedFromComparingData(
      'series',
      { id: 4 },
      findCurrentOfferedServiceById('GS0000001-225')
    );

    expect(result).toEqual(false);
  });

  it('should return true if current offeredService openingHours start date has changed', () => {
    const result = component.isArrayFieldChangedFromComparingData(
      'openingHours',
      {
        id: 123,
        startDate: 'Start Date'
      },
      findCurrentOfferedServiceById('GS0000001-74')
    );

    expect(result).toEqual(true);
  });

  it('should return true if current offeredService openingHours times.begin has changed', () => {
    const result = component.isArrayFieldChangedFromComparingData(
      'openingHours',
      {
        id: 123,
        times: { begin: 'Starting Time' }
      },
      findCurrentOfferedServiceById('GS0000001-74')
    );

    expect(result).toEqual(true);
  });

  it('should return false if current offeredService openingHours times.end has not changed', () => {
    const result = component.isArrayFieldChangedFromComparingData(
      'openingHours',
      {
        id: 123,
        times: { end: 'Ending Time' }
      },
      findCurrentOfferedServiceById('GS0000001-74')
    );

    expect(result).toEqual(false);
  });

  it('should return previous snapshot value if getFieldDataFromComparingData get invoked and the field value exists', () => {
    const result = component.getFieldDataFromComparingData(
      'service.id',
      findCurrentOfferedServiceById('GS0000001-74')
    );

    expect(result).toEqual(7);
  });

  it('should return undefined value if getFieldDataFromComparingData get invoked and the field value not exists', () => {
    const result = component.getFieldDataFromComparingData(
      'onlineOnly',
      findCurrentOfferedServiceById('GS0000001-226')
    );

    expect(result).toEqual(undefined);
  });

  it('should return previous value if getArrayFieldDataFromComparingData get invoked and the array object id exists', () => {
    const result = component.getArrayFieldDataFromComparingData(
      'openingHours',
      { id: 123 },
      'startDate',
      findCurrentOfferedServiceById('GS0000001-74')
    );

    expect(result).toEqual('Start Date 123');
  });

  it('should return true if isFieldChangedCompareWholeData invoked and the current offered service is updated', () => {
    const result = component.isFieldChangedCompareWholeData(
      findCurrentOfferedServiceById('GS0000001-1')
    );

    expect(result).toEqual(true);
  });

  it('should return true if isFieldChangedCompareWholeData invoked and the current offered service is newly added', () => {
    const result = component.isFieldChangedCompareWholeData(
      findCurrentOfferedServiceById('GS0000001-226')
    );

    expect(result).toEqual(true);
  });

  it('should return false if isFieldChangedCompareWholeData invoked and the current offered service is not updated', () => {
    const result = component.isFieldChangedCompareWholeData(
      findCurrentOfferedServiceById('GS0000001-70')
    );

    expect(result).toEqual(false);
  });

  it(`should return true if isArrayChanged invoked and the current offered service's communications is updated`, () => {
    const currentOfferedService = findCurrentOfferedServiceById('GS0000001-1');
    const result = component.isArrayChanged('communications', currentOfferedService);

    expect(result).toEqual(true);
  });

  it(`should return false if isArrayChanged invoked and the current offered service's communications is not updated`, () => {
    const currentOfferedService = findCurrentOfferedServiceById('GS0000001-70');
    const result = component.isArrayChanged('communications', currentOfferedService);

    expect(result).toEqual(false);
  });
});
