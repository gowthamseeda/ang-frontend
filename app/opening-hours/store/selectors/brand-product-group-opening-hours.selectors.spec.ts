import moment = require('moment');

import {
  getEmptyHours,
  getMBPcAndSmtPcAndMybPcStandardHourAllDaysFilled,
  getSingleDayClosedMbPcHours,
  getSingleDayClosedMbVan_FusoBusHours,
  getSingleDayClosedMbVan_SmtPc_FusoTruckVanSpecialHours,
  getSingleDayMbPcTruck_MbVan_SmtPCHours,
  getSpecialOpeningHoursMock,
  getSpecialOpeningHours_MB_SMT_2017_01_26,
  getSpecialOpeningHours_with_merged_standardOh_SMT_2017_01_26
} from '../../models/brand-product-group-opening-hours.mock';
import { initialState as initialStateOpeningHours } from '../reducers/brand-product-group-opening-hours.reducers';

import {
  selectBrandProductGroupOpeningHoursState,
  selectFilteredSpecialOpeningHours,
  selectGroupedSpecialHoursAfter,
  selectIsDataChangeTaskPresentForOpeningHours,
  selectIsVerificationTaskPresentForOpeningHours,
  selectSelectedBrandProductGroupOpeningHoursState,
  selectSpecialOpeningHourEvents,
  selectSpecialOpeningHours,
  selectStandardOpeningHours
} from './brand-product-group-opening-hours.selectors';

describe('BrandProductGroupOpeningHoursSelectors ', () => {
  describe('selectBrandProductGroupOpeningHoursState', () => {
    test('should return initial BrandProductGroupOpeningHours', () => {
      const state = {
        hours: {
          standardOpeningHours: [],
          specialOpeningHours: []
        }
      };
      const selection = (selectBrandProductGroupOpeningHoursState.projector as any)(state);
      expect(selection).toStrictEqual(initialStateOpeningHours);
    });
    test('should return mocked BrandProductGroupOpeningHours', () => {
      const brandProductGroupOpeningHours = getSpecialOpeningHoursMock();
      const state = {
        hours: {
          standardOpeningHours: brandProductGroupOpeningHours.standardOpeningHours,
          specialOpeningHours: brandProductGroupOpeningHours.specialOpeningHours
        }
      };
      const selection = (selectBrandProductGroupOpeningHoursState.projector as any)(state);
      expect(selection).toStrictEqual(brandProductGroupOpeningHours);
    });
  });

  describe('selectSpecialOpeningHourEvents', () => {
    test('should return SpecialOpeningHours after given dates', () => {
      const brandProductGroupOpeningHours = getSpecialOpeningHoursMock();
      const state = {
        hours: {
          standardOpeningHours: brandProductGroupOpeningHours.standardOpeningHours,
          specialOpeningHours: brandProductGroupOpeningHours.specialOpeningHours
        }
      };
      const dateFrom = moment().year(2016).startOf('year').toDate();
      const selection = (selectSpecialOpeningHourEvents(dateFrom).projector as any)(state);
      expect(selection).toStrictEqual([getSpecialOpeningHoursMock().specialOpeningHours[0]]);
    });
  });

  describe('selectSelectedBrandProductGroupOpeningHoursState', () => {
    test('should merge standard Opening Hours into Special Opening Hours', () => {
      const selectedSpecialOpeningHours = {
        standardOpeningHours: getMBPcAndSmtPcAndMybPcStandardHourAllDaysFilled(),
        specialOpeningHours: getSpecialOpeningHours_MB_SMT_2017_01_26()
      };
      const startDate = new Date('2017-01-26').getTime();
      const selection = selectSelectedBrandProductGroupOpeningHoursState.projector(
        getEmptyHours(),
        selectedSpecialOpeningHours,
        startDate
      );
      const expectedSpecialOpeningHours = getSpecialOpeningHours_with_merged_standardOh_SMT_2017_01_26();
      expect(selection.specialOpeningHours).toEqual(expectedSpecialOpeningHours);
    });
  });

  describe('selectStandardOpeningHours', () => {
    test('should deliver standard OpeningHours from store unchanged', () => {
      const hoursStateBefore = getSingleDayClosedMbPcHours();
      const selection = selectStandardOpeningHours.projector(hoursStateBefore);

      expect(selection).toStrictEqual(hoursStateBefore.standardOpeningHours);
    });
  });

  describe('selectSpecialOpeningHours', () => {
    test('should deliver special OpeningHours from store unchanged', () => {
      const hoursStateBefore = getSingleDayClosedMbPcHours();
      const selection = selectSpecialOpeningHours.projector(hoursStateBefore);

      expect(selection).toStrictEqual(hoursStateBefore.specialOpeningHours);
    });
  });

  describe('selectIsDataChangeTaskPresentForOpeningHours', () => {
    test('should deliver OpeningHours task data from store unchanged', () => {
      const hoursStateBefore = { ...getSingleDayClosedMbPcHours(), dataChangeTaskPresent: true };
      const selection = selectIsDataChangeTaskPresentForOpeningHours.projector(hoursStateBefore);

      expect(selection).toBeTruthy();
    });
  });

  describe('selectIsVerificationTaskPresentForOpeningHours', () => {
    test('should deliver OpeningHours task data from store unchanged', () => {
      const hoursStateBefore = { ...getSingleDayClosedMbPcHours(), verificationTaskPresent: true };
      const selection = selectIsVerificationTaskPresentForOpeningHours.projector(hoursStateBefore);

      expect(selection).toBeTruthy();
    });
  });

  describe('selectFilteredSpecialOpeningHours', () => {
    test('should return only special hours with end date later or equal then the given filter date', () => {
      const specialHoursStateBefore = getSingleDayClosedMbVan_SmtPc_FusoTruckVanSpecialHours()
        .specialOpeningHours;
      const dateFilter = new Date(2019, 5, 10);
      const selection = selectFilteredSpecialOpeningHours(dateFilter).projector(
        specialHoursStateBefore
      );

      expect(
        selection.every(specialHour => moment(specialHour.endDate).isSameOrAfter(dateFilter))
      ).toBe(true);
    });

    test('should return empty [] if there are no special hours with end date later then the given filter date', () => {
      const specialHoursStateBefore = getSingleDayClosedMbPcHours().specialOpeningHours;
      const dateFilter = new Date(2019, 10);
      const selection = selectFilteredSpecialOpeningHours(dateFilter).projector(
        specialHoursStateBefore
      );

      expect(selection).toStrictEqual([]);
    });

    test('should return empty [] if there are no special hours int the state', () => {
      const specialHoursStateBefore = [];
      const dateFilter = new Date();
      const selection = selectFilteredSpecialOpeningHours(dateFilter).projector(
        specialHoursStateBefore
      );

      expect(selection).toStrictEqual([]);
    });
  });

  describe('selectGroupedSpecialHoursAfter', () => {
    test('should group all special OpeningHours with same start date together', () => {
      const specialHoursStateBefore = getSingleDayMbPcTruck_MbVan_SmtPCHours().specialOpeningHours;
      const dateFilter = new Date(2000, 1);
      const selection = selectGroupedSpecialHoursAfter(dateFilter).projector(
        specialHoursStateBefore
      );

      expect(selection.length).toBe(2);
      const group_2019_09_12 = selection.filter(grouped =>
        moment(grouped.startDate).isSame('2019-09-12')
      );
      expect(group_2019_09_12.length).toBe(1);
      expect(group_2019_09_12[0].brandProductGroupInfo.length).toBe(3);
      expect(group_2019_09_12[0].brandProductGroupInfo.every(info => info.hasHours === true)).toBe(
        true
      );

      const group_2020_02_02 = selection.filter(grouped =>
        moment(grouped.startDate).isSame('2020-02-02')
      );
      expect(group_2020_02_02.length).toBe(1);
      expect(group_2020_02_02[0].brandProductGroupInfo.length).toBe(3);
      expect(group_2020_02_02[0].brandProductGroupInfo.every(info => info.hasHours === true)).toBe(
        true
      );
    });

    test('should return grouped special OpeningHours sorted by start date asc', () => {
      const specialHoursStateBefore = getSingleDayClosedMbVan_FusoBusHours().specialOpeningHours;
      const dateFilter = new Date(2000, 1);
      const selection = selectGroupedSpecialHoursAfter(dateFilter).projector(
        specialHoursStateBefore
      );

      expect(selection.length).toBe(3);
      expect(selection[0].startDate).toBe('2019-01-10');
      expect(selection[1].startDate).toBe('2019-09-10');
      expect(selection[2].startDate).toBe('2019-11-05');
    });

    test('should filter out special OpeningHours with persistent=false from grouping', () => {
      const specialHoursStateBefore = getSingleDayClosedMbVan_SmtPc_FusoTruckVanSpecialHours()
        .specialOpeningHours;
      const dateFilter = new Date(2000, 1);
      const selection = selectGroupedSpecialHoursAfter(dateFilter).projector(
        specialHoursStateBefore
      );

      expect(selection).toStrictEqual([]);
    });

    test('should return empty [] if there are no special OpeningHours', () => {
      const specialHoursStateBefore = [];
      const dateFilter = new Date(2000, 1);
      const selection = selectGroupedSpecialHoursAfter(dateFilter).projector(
        specialHoursStateBefore
      );

      expect(selection).toStrictEqual([]);
    });

    test('should return empty [] if there are only special OpeningHours te be filtered out', () => {
      const specialHoursStateBefore = getSingleDayClosedMbVan_SmtPc_FusoTruckVanSpecialHours()
        .specialOpeningHours;
      const dateFilter = new Date(2000, 1);
      const selection = selectGroupedSpecialHoursAfter(dateFilter).projector(
        specialHoursStateBefore
      );

      expect(selection).toStrictEqual([]);
    });
  });
});
