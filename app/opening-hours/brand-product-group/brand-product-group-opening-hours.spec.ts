import { ApiService } from '../../shared/services/api/api.service';
import {
  getMultiEditHoursData,
  getMultiSelectOfferedServiceIds,
  getTaskData
} from '../models/brand-product-group-opening-hours.mock';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { OpeningHourConvertion } from './brand-product-group-opening-hours';
import { OpeningHoursMock } from '../opening-hours.mock';
import { OpeningHoursService } from '../opening-hours.service';
import { Spy } from 'jest-auto-spies';
import { TestBed } from '@angular/core/testing';
import { TestingModule } from '../../testing/testing.module';

describe('BrandProductGroupOpeningHours', () => {
  let openingHoursServiceSpy: Spy<OpeningHoursService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, OpeningHoursService, LoggingService]
    });
    openingHoursServiceSpy = TestBed.inject<any>(OpeningHoursService);
  });

  test('should get Brand and ProductGroups', () => {
    const groupId = 'MBPC,VAN,BUS,TRUCK';
    const ORDER_BRANDS = [
      'MB',
      'SMT',
      'STR',
      'FUSO',
      'THB',
      'BAB',
      'FTL',
      'WST',
      'STG',
      'THB',
      'MYB'
    ];
    const map = OpeningHourConvertion.getBrandAndProductGroups(groupId, ORDER_BRANDS);
    expect(map.keys().next().value).toEqual('MB');
    expect(map.values().next().value).toEqual(['PC', 'VAN', 'BUS', 'TRUCK']);
  });

  test('should return getMultiEditOpeningHoursForRequest', () => {
    const multiSelectOfferedServiceIds = getMultiSelectOfferedServiceIds();
    const multiEditHours = getMultiEditHoursData();
    const multiEditOpeningHour = OpeningHourConvertion.getMultiEditOpeningHoursForRequest(
      multiEditHours.standardOpeningHours,
      multiSelectOfferedServiceIds
    );
    expect(multiEditOpeningHour.length).toEqual(4);
    expect(multiEditOpeningHour).toEqual(OpeningHoursMock.multiEditOpeningHours());
  });

  test('should return getMultiEditSpecialOpeningHoursForRequest', () => {
    const multiSelectOfferedServiceIds = getMultiSelectOfferedServiceIds();
    const multiEditHours = getMultiEditHoursData();
    const multiEditSpecialOpeningHour =
      OpeningHourConvertion.getMultiEditSpecialOpeningHoursForRequest(
        multiEditHours.specialOpeningHours,
        multiSelectOfferedServiceIds
      );
    expect(multiEditSpecialOpeningHour.length).toEqual(4);
    expect(multiEditSpecialOpeningHour).toEqual(OpeningHoursMock.multiEditSpecialOpeningHours());
  });

  it('should be created', () => {
    expect(openingHoursServiceSpy).toBeTruthy();
  });

  test('should return get updateMultiEditOpeningHourData', () => {
    const multiSelectOfferedServiceIds = getMultiSelectOfferedServiceIds();
    const multiEditHours = getMultiEditHoursData();
    const task = getTaskData();
    openingHoursServiceSpy
      .updateMultiEditOpeningHourData(multiEditHours, multiSelectOfferedServiceIds, task)
      .subscribe(result => {
        expect(result).toBeTruthy();
      });
  });
});
