import { WeekDay } from '@angular/common';
import moment from 'moment';

import {
  getDifferentSpecialOpeningHoursMock,
  getEmptyHours,
  getMBSpecialOpeningHoursMock,
  getMondayClosedFusoBusStandardHour,
  getMondayClosedFusoBusVanStandardHour,
  getMondayClosedFusoTruckStandardHour,
  getMondayClosedFusoUnimogStandardHour,
  getMondayClosedFusoUnimogVanStandardHour,
  getMondayClosedFusoVanStandardHour,
  getMondayClosedMbPcTruckStandardHour,
  getMondayClosedMbVanStandardHour,
  getMondayOpenFusoTruckVanStandardHour,
  getSingleDayClosedMbVan_SmtPc_FusoBus_FusoTruckVan_FusoUnimogHours,
  getSingleDayClosedMbVan_SmtPc_FusoTruckVanSpecialHours,
  getSingleDayClosed_OneSpecial_MbVan_FusoBusHours,
  getSingleDayMbPcTruck_MbVan_SmtPCHours,
  getSpecialOpeningHours,
  getSpecialOpeningHoursMock,
  getSpecialOpeningHours_MB_2016_01_26,
  getSpecialOpeningHours_MB_PC_2017_01_26,
  getSpecialOpeningHours_MB_Without_PC_2017_01_26,
  getSpecialOpeningHours_SMT_2016_01_26,
  getSpecialOpeningHours_SMT_2017_01_26,
  getSundayClosedSmtPcStandardHour
} from '../../models/brand-product-group-opening-hours.mock';
import { SpecialOpeningHour, StandardOpeningHour } from '../../models/opening-hour.model';
import { OpeningHoursPermissions } from '../../models/opening-hours-permissions.model';
import { BrandProductGroupOpeningHoursActions } from '../actions';
import { Direction } from '../actions/brand-product-group-opening-hours.actions';

import * as fromHours from './brand-product-group-opening-hours.reducers';
import { Hours, Outlet, Service } from './index';

describe('BrandProductGroupOpeningHours Reducer Suite ', () => {
  const anyService: Service = {
    serviceId: 0,
    productCategoryId: 'scId',
    serviceCharacteristicsId: 'scsId',
    serviceName: 'sName',
    serviceCharacteristicName: 'scName',
    name: 'name',
    translations: {}
  };
  const anyOutlet: Outlet = {
    businessSiteId: 'GS1234562',
    countryId: 'cId'
  };
  const anyPermissions: OpeningHoursPermissions = {
    brandRestrictions: [],
    productGroupRestrictions: []
  };

  describe('undefined action ', () => {
    test('should not change state.', () => {
      const stateBefore = {
        ...fromHours.initialState
      };
      const expectedState = stateBefore;
      const action: any = {};
      const state = fromHours.reducer(stateBefore, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('openingHoursLoadSuccess action', () => {
    test('should change all attributes in state', () => {
      const stateBefore = fromHours.initialState;
      const standardOpeningHours = [getMondayClosedMbPcTruckStandardHour()];
      const action: any = BrandProductGroupOpeningHoursActions.brandProductGroupOpeningHoursLoadSuccess(
        {
          service: anyService,
          hours: {
            standardOpeningHours: standardOpeningHours,
            specialOpeningHours: getSpecialOpeningHours()
          },
          outlet: anyOutlet,
          permissions: anyPermissions
        }
      );
      const expectedHours = getEmptyHours();
      expectedHours.specialOpeningHours = getSpecialOpeningHours();
      expectedHours.standardOpeningHours = standardOpeningHours;
      const state = fromHours.reducer(stateBefore, action);
      expect(state).toEqual(expectedHours);
    });
  });

  describe('openingHoursUpdateSuccess action', () => {
    test('should update opening hours in state', () => {
      const stateBefore = fromHours.initialState;
      const standardOpeningHours = [getMondayClosedMbPcTruckStandardHour()];
      const action: any = BrandProductGroupOpeningHoursActions.openingHoursUpdateSuccess({
        hours: {
          standardOpeningHours: standardOpeningHours,
          specialOpeningHours: getSpecialOpeningHours()
        }
      });
      const expectedHours: Hours = {
        ...getEmptyHours(),
        specialOpeningHours: getSpecialOpeningHours(),
        standardOpeningHours: standardOpeningHours
      };
      const state = fromHours.reducer(stateBefore, action);
      expect(state).toEqual(expectedHours);
    });

    test('should update opening hours and task data in state', () => {
      const stateBefore = fromHours.initialState;
      const standardOpeningHours = [getMondayClosedMbPcTruckStandardHour()];
      const action: any = BrandProductGroupOpeningHoursActions.openingHoursUpdateSuccess({
        hours: {
          standardOpeningHours: standardOpeningHours,
          specialOpeningHours: getSpecialOpeningHours()
        },
        taskData: {
          comment: 'any_comment'
        }
      });
      const expectedHours: Hours = {
        ...getEmptyHours(),
        specialOpeningHours: getSpecialOpeningHours(),
        standardOpeningHours: standardOpeningHours,
        dataChangeTaskPresent: true
      };
      const state = fromHours.reducer(stateBefore, action);
      expect(state).toEqual(expectedHours);
    });
  });

  describe('openingHoursUpdateSuccess action', () => {
    test('should update task data', () => {
      const stateBefore: Hours = { ...fromHours.initialState, dataChangeTaskPresent: true };
      const action = BrandProductGroupOpeningHoursActions.loadTaskSuccess({
        dataChangeTaskPresent: undefined,
        verificationTaskPresent: true
      });

      const expectedHours: Hours = {
        ...fromHours.initialState,
        verificationTaskPresent: true
      };
      const state = fromHours.reducer(stateBefore, action);
      expect(state).toEqual(expectedHours);
    });
  });

  describe('specialOpeningHoursFirstDaySelected action', () => {
    test('add new special opening hours with all brand, product group combinations from standard hours', () => {
      const stateBefore = getSingleDayClosedMbVan_SmtPc_FusoTruckVanSpecialHours();
      const countStandard: number = stateBefore.standardOpeningHours.length;
      const countSpecialExpected: number = countStandard + stateBefore.specialOpeningHours.length;
      const date = new Date(2019, 10);
      const dateExpected = moment(date).format('YYYY-MM-DD');
      const action = BrandProductGroupOpeningHoursActions.specialOpeningHoursFirstDaySelected({
        date: date.getTime()
      });

      const state = fromHours.reducer(stateBefore, action);

      expect(state.specialOpeningHours.length).toEqual(countSpecialExpected);
      const addedSpecialHours = state.specialOpeningHours.filter(
        special => special.startDate === dateExpected
      );
      expect(addedSpecialHours.length).toEqual(countStandard);
      expect(addedSpecialHours.some(specialHour => specialHour.brandId === 'MB')).toBeTruthy();
      expect(addedSpecialHours.some(specialHour => specialHour.brandId === 'SMT')).toBeTruthy();
      expect(addedSpecialHours.every(specialHour => specialHour.configured === false)).toBeTruthy();
    });
  });

  describe('specialOpeningHoursSecondDaySelected action', () => {
    test('sets start and end date correct', () => {
      const stateBefore = getSingleDayClosedMbVan_SmtPc_FusoTruckVanSpecialHours();
      const countSpecial: number = stateBefore.specialOpeningHours.length;

      const dateSelectedFirst = new Date(2019, 4, 10);
      const dateSelectedSecond = new Date(2019, 4, 2);
      const countSpecialForDay = stateBefore.specialOpeningHours.filter(specialHour =>
        moment(specialHour.startDate).isSame(dateSelectedFirst, 'd')
      ).length;

      const action = BrandProductGroupOpeningHoursActions.specialOpeningHoursSecondDaySelected({
        creationDate: dateSelectedFirst.getTime(),
        firstDateSelected: dateSelectedFirst.getTime(),
        secondDateSelected: dateSelectedSecond.getTime()
      });

      const state = fromHours.reducer(stateBefore, action);

      expect(state.specialOpeningHours.length).toEqual(countSpecial);
      const changedSpecialHours = state.specialOpeningHours.filter(special =>
        moment(special.startDate).isSame(dateSelectedSecond, 'd')
      );
      expect(changedSpecialHours.length).toEqual(countSpecialForDay);
      expect(
        changedSpecialHours.every(specialHour =>
          moment(specialHour.startDate).isSame(dateSelectedSecond, 'd')
        )
      ).toBeTruthy();
      expect(
        changedSpecialHours.every(specialHour => specialHour.configured === false)
      ).toBeTruthy();
    });
  });

  describe('deleteCreatedSpecialOpeningHours action', () => {
    test('removes marked special opening hours', () => {
      const stateBefore = getSingleDayClosedMbVan_SmtPc_FusoTruckVanSpecialHours();
      const action = BrandProductGroupOpeningHoursActions.removeUnchangedSpecialOpeningHours();

      const state = fromHours.reducer(stateBefore, action);

      expect(state.specialOpeningHours.filter(hour => hour.configured !== undefined)).toHaveLength(
        0
      );
    });
  });

  describe('specialOpeningHoursChangedFirstTime action', () => {
    test('should update values and mark marked all matching special opening hours as configured', () => {
      const stateBefore: Hours = getSingleDayClosedMbVan_SmtPc_FusoTruckVanSpecialHours();
      const dateChanged = moment('2019-05-10');
      const dataChanged: Hours = {
        standardOpeningHours: [],
        specialOpeningHours: [
          {
            ...getMondayOpenFusoTruckVanStandardHour(),
            productGroupIds: ['VAN', 'TRUCK'], // use different ordering
            openingHours: [
              {
                ...getMondayOpenFusoTruckVanStandardHour().openingHours[0],
                changed: true
              }
            ],
            startDate: '2019-05-10',
            endDate: '2019-05-10',
            configured: false
          }
        ]
      };
      const action = BrandProductGroupOpeningHoursActions.specialOpeningHoursChangedFirstTime({
        date: dateChanged.valueOf(),
        hours: dataChanged
      });

      const state = fromHours.reducer(stateBefore, action);

      const changedSpecialHours: SpecialOpeningHour[] = state.specialOpeningHours.filter(special =>
        moment(special.startDate).isSame(dateChanged, 'd')
      );
      expect(changedSpecialHours).toHaveLength(3);
      expect(changedSpecialHours.every(special => special.configured)).toBe(true);
      expect(
        changedSpecialHours.filter(special => special.brandId === 'FUSO')[0].openingHours
      ).toStrictEqual(getMondayOpenFusoTruckVanStandardHour().openingHours);
    });
  });

  describe('deleteSpecialOpeningHours action', () => {
    test('should delete an entry of special-opening hours', () => {
      const stateBefore = getDifferentSpecialOpeningHoursMock();
      const action = BrandProductGroupOpeningHoursActions.deleteSpecialOpeningHours({
        date: moment('2017-01-26').valueOf()
      });
      const expectedSpecialOpeningHoursState = [
        {
          brandId: 'MB',
          productGroupIds: ['PC', 'VAN'],
          startDate: '2019-01-26',
          endDate: '2019-01-29',
          configured: false,
          openingHours: [
            {
              weekDay: WeekDay.Wednesday,
              closed: false,
              times: [
                { begin: '05:00', end: '11:00' },
                { begin: '13:30', end: '19:00' }
              ]
            }
          ]
        },
        {
          brandId: 'SMT',
          productGroupIds: ['PC'],
          startDate: '2018-01-26',
          endDate: '2018-01-29',
          configured: false,
          openingHours: [
            {
              weekDay: WeekDay.Thursday,
              closed: false,
              times: [
                { begin: '09:00', end: '11:00' },
                { begin: '13:00', end: '20:00' }
              ]
            }
          ]
        }
      ];

      const state = fromHours.reducer(stateBefore, action);
      expect(state.specialOpeningHours).toHaveLength(2);
      expect(state.specialOpeningHours).toStrictEqual(expectedSpecialOpeningHoursState);
    });

    test('should delete all entries of special-opening hours', () => {
      const stateBefore = getSpecialOpeningHoursMock();
      const action = BrandProductGroupOpeningHoursActions.deleteSpecialOpeningHours({
        date: moment('2017-01-26').valueOf()
      });

      const state = fromHours.reducer(stateBefore, action);
      expect(state.specialOpeningHours).toHaveLength(0);
    });
  });

  describe('resetSpecialOpeningHours action', () => {
    test('with no restrictions should only remove opening hours values for special openingHours witch matching start date', () => {
      const stateBefore = getSingleDayMbPcTruck_MbVan_SmtPCHours();
      const date: number = moment('2020-02-02').valueOf();
      const action = BrandProductGroupOpeningHoursActions.resetSpecialOpeningHours({
        date: date,
        restrictedBrands: [],
        restrictedProductGroups: []
      });

      const state = fromHours.reducer(stateBefore, action);
      expect(state.specialOpeningHours).toHaveLength(stateBefore.specialOpeningHours.length);

      const changedSpecials: SpecialOpeningHour[] = state.specialOpeningHours.filter(special =>
        moment(special.startDate).isSame(date, 'd')
      );
      expect(changedSpecials).toHaveLength(3);
      expect(changedSpecials.every(special => special.openingHours.length === 0)).toBe(true);

      const unChangedSpecials: SpecialOpeningHour[] = state.specialOpeningHours.filter(
        special => !moment(special.startDate).isSame(date, 'd')
      );
      expect(unChangedSpecials).toHaveLength(3);
      expect(unChangedSpecials.every(special => special.openingHours.length > 0)).toBe(true);
    });

    test('with brand restrictions should only remove opening hours values for special openingHours witch matching restrictions', () => {
      const stateBefore = getSingleDayClosed_OneSpecial_MbVan_FusoBusHours();
      const date: number = moment('2019-09-10').valueOf();
      const action = BrandProductGroupOpeningHoursActions.resetSpecialOpeningHours({
        date: date,
        restrictedBrands: ['FUSO', 'SMT'],
        restrictedProductGroups: []
      });

      const state = fromHours.reducer(stateBefore, action);

      const changedSpecials: SpecialOpeningHour[] = state.specialOpeningHours.filter(
        special => special.brandId === 'FUSO'
      );
      expect(changedSpecials).toHaveLength(1);
      expect(changedSpecials[0].openingHours.length).toBe(0);

      const unChangedSpecials: SpecialOpeningHour[] = state.specialOpeningHours.filter(
        special => special.brandId !== 'FUSO'
      );
      expect(unChangedSpecials).toHaveLength(1);
      expect(unChangedSpecials[0].openingHours.length).toBeGreaterThan(0);
    });

    test('with productGroup restrictions should only remove opening hours values for special openingHours witch matching productGroups', () => {
      const stateBefore = getSingleDayClosed_OneSpecial_MbVan_FusoBusHours();
      const date: number = moment('2019-09-10').valueOf();
      const action = BrandProductGroupOpeningHoursActions.resetSpecialOpeningHours({
        date: date,
        restrictedBrands: [],
        restrictedProductGroups: ['PC', 'VAN']
      });

      const state = fromHours.reducer(stateBefore, action);

      const changedSpecials: SpecialOpeningHour[] = state.specialOpeningHours.filter(
        special => special.productGroupIds.join() === ['VAN'].join()
      );
      expect(changedSpecials).toHaveLength(1);
      expect(changedSpecials[0].openingHours.length).toBe(0);

      const unChangedSpecials: SpecialOpeningHour[] = state.specialOpeningHours.filter(
        special => special.productGroupIds.join() !== ['VAN'].join()
      );
      expect(unChangedSpecials).toHaveLength(1);
      expect(unChangedSpecials[0].openingHours.length).toBeGreaterThan(0);
    });
  });

  describe('detachProductFromBrandGroup', () => {
    test('should detach product group from brand (standard opening hours) and takes over time values', () => {
      const stateBefore = getSingleDayClosedMbVan_SmtPc_FusoTruckVanSpecialHours();
      const expectedStandard: StandardOpeningHour[] = [
        getMondayClosedMbVanStandardHour(),
        getSundayClosedSmtPcStandardHour(),
        getMondayClosedFusoTruckStandardHour(),
        getMondayClosedFusoVanStandardHour()
      ];
      const action = BrandProductGroupOpeningHoursActions.detachProductGroupFromBrand({
        brandId: 'FUSO',
        productGroupId: 'VAN'
      });
      const state = fromHours.reducer(stateBefore, action);
      expect(state.standardOpeningHours).toStrictEqual(expectedStandard);
      expect(state.specialOpeningHours).toStrictEqual(stateBefore.specialOpeningHours);
      const expectedTimes = [
        {
          begin: '05:00',
          end: '11:00'
        },
        {
          begin: '13:30',
          end: '19:00'
        }
      ];
      const stOh: StandardOpeningHour | undefined = state.standardOpeningHours.find(
        oh => oh.brandId === 'MB'
      );
      if (stOh) {
        const openingHour = stOh.openingHours.find(oh => oh.weekDay === WeekDay.Wednesday);
        if (openingHour) {
          expect(openingHour.times).toStrictEqual(expectedTimes);
        }
      }
    });

    test('should detach product group from brand (special opening hours) and takes over time values ', () => {
      const stateBefore = getSingleDayClosedMbVan_SmtPc_FusoTruckVanSpecialHours();
      stateBefore.specialOpeningHours = getSpecialOpeningHours();
      const dateChanged = new Date('2017-01-26').getTime();
      const expectedSpecial: SpecialOpeningHour[] = [
        getSpecialOpeningHours_MB_Without_PC_2017_01_26(),
        getSpecialOpeningHours_MB_PC_2017_01_26(),
        getSpecialOpeningHours_MB_2016_01_26(),
        getSpecialOpeningHours_SMT_2017_01_26(),
        getSpecialOpeningHours_SMT_2016_01_26()
      ];
      const action = BrandProductGroupOpeningHoursActions.detachProductGroupFromBrand({
        brandId: 'MB',
        productGroupId: 'PC',
        startDate: dateChanged
      });
      const state = fromHours.reducer(stateBefore, action);
      expect(state.standardOpeningHours).toStrictEqual(stateBefore.standardOpeningHours);
      expect(state.specialOpeningHours).toStrictEqual(expectedSpecial);
      if (state.specialOpeningHours) {
        const expectedTimes = [
          {
            begin: '05:00',
            end: '11:00'
          },
          {
            begin: '13:30',
            end: '19:00'
          }
        ];
        const spOh: SpecialOpeningHour | undefined = state.specialOpeningHours.find(
          oh => oh.brandId === 'MB'
        );
        if (spOh) {
          const openingHour = spOh.openingHours.find(oh => oh.weekDay === WeekDay.Wednesday);
          if (openingHour) {
            expect(openingHour.times).toStrictEqual(expectedTimes);
          }
        }
      }
    });
    test('should mark all detached columns as none persistent if source is none persistent', () => {
      const stateBefore = getEmptyHours();
      stateBefore.specialOpeningHours = getSpecialOpeningHours().map(spOh => {
        return {
          ...spOh,
          configured: false
        };
      });
      const dateChanged = new Date('2017-01-26').getTime();
      const action = BrandProductGroupOpeningHoursActions.detachProductGroupFromBrand({
        brandId: 'MB',
        productGroupId: 'PC',
        startDate: dateChanged
      });
      expect(
        stateBefore.specialOpeningHours.filter(special =>
          moment(special.startDate).isSame(dateChanged, 'd')
        ).length
      ).toEqual(2);
      const state = fromHours.reducer(stateBefore, action);
      const changedSpecialHours = state.specialOpeningHours.filter(special =>
        moment(special.startDate).isSame(dateChanged, 'd')
      );
      expect(changedSpecialHours.length).toEqual(3);
      changedSpecialHours.forEach(spOh => {
        expect(spOh.configured).toBeFalsy();
      });
    });
    test('should not mark detached columns as non-configured if source is configured', () => {
      const stateBefore = getEmptyHours();
      const dateChanged = new Date('2017-01-26').getTime();
      stateBefore.specialOpeningHours = getSpecialOpeningHours().map(spOh => {
        return {
          ...spOh,
          configured: true
        };
      });
      const action = BrandProductGroupOpeningHoursActions.detachProductGroupFromBrand({
        brandId: 'MB',
        productGroupId: 'PC',
        startDate: dateChanged
      });
      expect(
        stateBefore.specialOpeningHours.filter(special =>
          moment(special.startDate).isSame(dateChanged, 'd')
        ).length
      ).toEqual(2);
      const state = fromHours.reducer(stateBefore, action);
      const changedSpecialHours = state.specialOpeningHours.filter(special =>
        moment(special.startDate).isSame(dateChanged, 'd')
      );
      expect(changedSpecialHours.length).toEqual(3);
      changedSpecialHours.forEach(spOh => {
        expect(spOh.configured).toBeTruthy();
      });
    });
  });

  describe('dropProductGroupColumn action', () => {
    test(
      'should delete standard opening hours for given brand, product group' +
        ' and add given product group to correct existing group data',
      () => {
        const stateBefore = getSingleDayMbPcTruck_MbVan_SmtPCHours();

        const action = BrandProductGroupOpeningHoursActions.dropProductGroupColumn({
          brandId: 'MB',
          productGroupId: 'VAN'
        });

        const state = fromHours.reducer(stateBefore, action);

        expect(state.standardOpeningHours.length).toEqual(2);
        expect(state.standardOpeningHours.filter(hours => hours.brandId === 'SMT').length).toEqual(
          1
        );
        const mb = state.standardOpeningHours.filter(hours => hours.brandId === 'MB');
        expect(mb.length).toEqual(1);

        const mbVan = mb.find(hours => hours.productGroupIds.sort().join(';') === 'VAN');
        expect(mbVan).toBeUndefined();

        const mbPcTruck = mb.find(hours => hours.productGroupIds.sort().join(';') === 'PC;TRUCK');
        expect(mbPcTruck).toBeUndefined();

        const mbPcTruckVan = mb.find(
          hours => hours.productGroupIds.sort().join(';') === 'PC;TRUCK;VAN'
        );
        expect(mbPcTruckVan).toBeDefined();
      }
    );

    test(
      'should delete special opening hours for given brand, product group' +
        ' and add given product group to correct existing group data',
      () => {
        const stateBefore = getSingleDayMbPcTruck_MbVan_SmtPCHours();
        const startDate = '2019-09-12';

        const action = BrandProductGroupOpeningHoursActions.dropProductGroupColumn({
          brandId: 'MB',
          productGroupId: 'VAN',
          startDate: moment(startDate).valueOf()
        });

        const state = fromHours.reducer(stateBefore, action);

        expect(state.specialOpeningHours.length).toEqual(5);
        const changedSpecialHours = state.specialOpeningHours.filter(
          hours => hours.startDate === startDate
        );
        expect(changedSpecialHours.length).toEqual(2);

        expect(changedSpecialHours.filter(hours => hours.brandId === 'SMT').length).toEqual(1);
        const mb = changedSpecialHours.filter(hours => hours.brandId === 'MB');
        expect(mb.length).toEqual(1);

        const mbVan = mb.find(hours => hours.productGroupIds.sort().join(';') === 'VAN');
        expect(mbVan).toBeUndefined();

        const mbPcTruck = mb.find(hours => hours.productGroupIds.sort().join(';') === 'PC;TRUCK');
        expect(mbPcTruck).toBeUndefined();

        const mbPcTruckVan = mb.find(
          hours => hours.productGroupIds.sort().join(';') === 'PC;TRUCK;VAN'
        );
        expect(mbPcTruckVan).toBeDefined();
      }
    );
  });
  describe('moveStandardOpeningHoursProductGroup action', () => {
    test('should move given standard opening hours product group to the right', () => {
      const stateBefore = getSingleDayClosedMbVan_SmtPc_FusoBus_FusoTruckVan_FusoUnimogHours();
      const expectedStandard: StandardOpeningHour[] = [
        getMondayClosedMbVanStandardHour(),
        getSundayClosedSmtPcStandardHour(),
        getMondayClosedFusoBusStandardHour(),
        getMondayClosedFusoTruckStandardHour(),
        getMondayClosedFusoUnimogVanStandardHour()
      ];
      const action = BrandProductGroupOpeningHoursActions.moveStandardOpeningHoursProductGroup({
        brandId: 'FUSO',
        productGroupId: 'VAN',
        direction: Direction.Right
      });
      const state = fromHours.reducer(stateBefore, action);
      expect(state.standardOpeningHours).toStrictEqual(expectedStandard);
      expect(state.specialOpeningHours).toStrictEqual(stateBefore.specialOpeningHours);
    });

    test('should move given standard opening hours product group to the left', () => {
      const stateBefore = getSingleDayClosedMbVan_SmtPc_FusoBus_FusoTruckVan_FusoUnimogHours();
      const expectedStandard: StandardOpeningHour[] = [
        getMondayClosedMbVanStandardHour(),
        getSundayClosedSmtPcStandardHour(),
        getMondayClosedFusoBusVanStandardHour(),
        getMondayClosedFusoTruckStandardHour(),
        getMondayClosedFusoUnimogStandardHour()
      ];
      const action = BrandProductGroupOpeningHoursActions.moveStandardOpeningHoursProductGroup({
        brandId: 'FUSO',
        productGroupId: 'VAN',
        direction: Direction.Left
      });
      const state = fromHours.reducer(stateBefore, action);
      expect(state.standardOpeningHours).toStrictEqual(expectedStandard);
      expect(state.specialOpeningHours).toStrictEqual(stateBefore.specialOpeningHours);
    });
  });

  describe('moveSpecialOpeningHoursProductGroup action', () => {
    test('should move special opening hours product group to the right', () => {
      const dateChanged = new Date('2019-06-11').getTime();
      const stateBefore = getSingleDayClosedMbVan_SmtPc_FusoBus_FusoTruckVan_FusoUnimogHours();
      const expectedSpecial_2019_05_10 = stateBefore.specialOpeningHours.filter(
        specialHour => specialHour.startDate === '2019-05-10'
      );
      const expectedSpecial_2019_06_11: SpecialOpeningHour[] = [
        stateBefore.specialOpeningHours[2],
        stateBefore.specialOpeningHours[3],
        stateBefore.specialOpeningHours[4],
        {
          ...getMondayClosedFusoTruckStandardHour(),
          startDate: '2019-06-11',
          endDate: '2019-06-25',
          configured: true
        },
        {
          ...getMondayClosedFusoUnimogVanStandardHour(),
          startDate: '2019-06-11',
          endDate: '2019-06-25',
          configured: true
        }
      ];
      const action = BrandProductGroupOpeningHoursActions.moveSpecialOpeningHoursProductGroup({
        brandId: 'FUSO',
        productGroupId: 'VAN',
        startDate: dateChanged,
        direction: Direction.Right
      });

      const state = fromHours.reducer(stateBefore, action);
      expect(state.standardOpeningHours).toStrictEqual(stateBefore.standardOpeningHours);
      expect(
        state.specialOpeningHours.filter(specialHour => specialHour.startDate === '2019-05-10')
      ).toStrictEqual(expectedSpecial_2019_05_10);
      expect(
        state.specialOpeningHours.filter(specialHour => specialHour.startDate === '2019-06-11')
      ).toStrictEqual(expectedSpecial_2019_06_11);
    });

    test('should move special opening hours product group to the left', () => {
      const dateChanged = new Date('2019-06-11').getTime();
      const stateBefore = getSingleDayClosedMbVan_SmtPc_FusoBus_FusoTruckVan_FusoUnimogHours();
      const expectedSpecial_2019_05_10 = stateBefore.specialOpeningHours.filter(
        specialHour => specialHour.startDate === '2019-05-10'
      );
      const expectedSpecial_2019_06_11: SpecialOpeningHour[] = [
        stateBefore.specialOpeningHours[2],
        stateBefore.specialOpeningHours[3],
        {
          ...getMondayClosedFusoBusVanStandardHour(),
          startDate: '2019-06-11',
          endDate: '2019-06-25',
          configured: true
        },
        {
          ...getMondayClosedFusoTruckStandardHour(),
          startDate: '2019-06-11',
          endDate: '2019-06-25',
          configured: true
        },
        stateBefore.specialOpeningHours[6]
      ];
      const action = BrandProductGroupOpeningHoursActions.moveSpecialOpeningHoursProductGroup({
        brandId: 'FUSO',
        productGroupId: 'VAN',
        startDate: dateChanged,
        direction: Direction.Left
      });

      const state = fromHours.reducer(stateBefore, action);
      expect(state.standardOpeningHours).toStrictEqual(stateBefore.standardOpeningHours);
      expect(
        state.specialOpeningHours.filter(specialHour => specialHour.startDate === '2019-05-10')
      ).toStrictEqual(expectedSpecial_2019_05_10);
      expect(
        state.specialOpeningHours.filter(specialHour => specialHour.startDate === '2019-06-11')
      ).toStrictEqual(expectedSpecial_2019_06_11);
    });
  });
  describe('updateOpeningHours', () => {
    test('should update state if opening hours value has changed', () => {
      const stateBefore = getEmptyHours();
      const dateChanged = new Date('2017-01-26').getTime();
      const specialOpeningHours = getMBSpecialOpeningHoursMock();
      stateBefore.specialOpeningHours = specialOpeningHours.specialOpeningHours;
      const changedHours: Hours = {
        standardOpeningHours: [],
        specialOpeningHours: [
          {
            brandId: 'MB',
            productGroupIds: ['VAN', 'BUS'],
            startDate: '2017-01-26',
            endDate: '2017-01-29',
            configured: true,
            openingHours: [
              {
                weekDay: WeekDay.Tuesday,
                closed: false,
                changed: true,
                times: [{ begin: '08:00', end: '17:00' }]
              }
            ]
          },
          {
            brandId: 'MB',
            productGroupIds: ['PC'],
            startDate: '2018-01-26',
            endDate: '2018-01-29',
            configured: true,
            openingHours: [
              {
                weekDay: WeekDay.Thursday,
                closed: false,
                times: [
                  { begin: '12:00', end: '13:00' },
                  { begin: '14:00', end: '21:00' }
                ]
              }
            ]
          },
          {
            brandId: 'MB',
            productGroupIds: ['TRUCK', 'UNIMOG'],
            startDate: '2017-01-26',
            endDate: '2017-01-29',
            configured: true,
            openingHours: [
              {
                weekDay: WeekDay.Thursday,
                closed: false,
                times: [
                  { begin: '09:01', end: '11:01' },
                  { begin: '13:01', end: '20:01' }
                ]
              }
            ]
          }
        ]
      };
      const action = BrandProductGroupOpeningHoursActions.updateOpeningHours({
        date: dateChanged,
        hours: changedHours
      });
      const state = fromHours.reducer(stateBefore, action);
      const expected = [
        {
          brandId: 'MB',
          productGroupIds: ['VAN', 'BUS'],
          startDate: '2017-01-26',
          endDate: '2017-01-29',
          configured: true,
          openingHours: [
            {
              weekDay: WeekDay.Wednesday,
              closed: false,
              times: [
                { begin: '05:00', end: '11:00' },
                { begin: '13:30', end: '19:00' }
              ]
            },
            {
              weekDay: WeekDay.Tuesday,
              closed: false,
              times: [{ begin: '08:00', end: '17:00' }]
            }
          ]
        },
        {
          brandId: 'MB',
          productGroupIds: ['PC'],
          startDate: '2017-01-26',
          endDate: '2017-01-29',
          configured: true,
          openingHours: [
            {
              weekDay: WeekDay.Thursday,
              closed: false,
              times: [
                { begin: '09:00', end: '11:00' },
                { begin: '13:00', end: '20:00' }
              ]
            }
          ]
        },
        {
          brandId: 'MB',
          productGroupIds: ['TRUCK', 'UNIMOG'],
          startDate: '2017-01-26',
          endDate: '2017-01-29',
          configured: true,
          openingHours: [
            {
              weekDay: WeekDay.Thursday,
              closed: false,
              times: [
                { begin: '09:01', end: '11:01' },
                { begin: '13:01', end: '20:01' }
              ]
            }
          ]
        }
      ];
      expect(state.specialOpeningHours).toStrictEqual(expected);
    });
  });
});
