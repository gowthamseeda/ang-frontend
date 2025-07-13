import { OfferedServiceMock } from '../../offered-service.mock';

import { OfferedServiceApiActions, OfferedServiceServiceActions } from '../actions';
import * as fromOfferedService from './offered-service.reducer';

describe('Offered Service Reducer', () => {
  const offeredServices = OfferedServiceMock.asList();
  const offeredServiceIds = OfferedServiceMock.asIds();
  const offeredServiceEntities = OfferedServiceMock.asMap();

  describe('undefined action', () => {
    it('should return default state', () => {
      const { initialState } = fromOfferedService;
      const action = {} as any;
      const state = fromOfferedService.reducer(undefined, action);
      expect(state).toEqual(initialState);
    });
  });

  describe('loadOfferedServicesSuccess', () => {
    it('should load state accordingly', () => {
      const expectedState: fromOfferedService.State = {
        ids: offeredServiceIds,
        entities: offeredServiceEntities,
        loading: false
      };
      const { initialState } = fromOfferedService;
      const action = OfferedServiceApiActions.loadOfferedServicesSuccess({
        offeredServices: offeredServices
      });
      const state = fromOfferedService.reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('loadOfferedServicesError', () => {
    it('should clear all entries on error', () => {
      const expectedState: fromOfferedService.State = {
        ids: [],
        entities: {},
        loading: false
      };
      const initialState: fromOfferedService.State = {
        ids: offeredServiceIds,
        entities: offeredServiceEntities
      };
      const action = OfferedServiceApiActions.loadOfferedServicesError({
        error: new Error('error')
      });
      const state = fromOfferedService.reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('resetOfferedServices', () => {
    it('should reset the state', () => {
      const expectedState: fromOfferedService.State = {
        ids: [],
        entities: {}
      };

      const initialState: fromOfferedService.State = {
        ids: offeredServiceIds,
        entities: offeredServiceEntities
      };

      const action = OfferedServiceServiceActions.resetOfferedServices();
      const state = fromOfferedService.reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('addOfferedService', () => {
    it('should add a new offered Service to the state', () => {
      const expectedState: fromOfferedService.State = {
        ids: offeredServiceIds,
        entities: offeredServiceEntities
      };
      const initialState = {
        ids: [
          offeredServiceIds[0],
          offeredServiceIds[1],
          offeredServiceIds[2],
          offeredServiceIds[3]
        ],
        entities: {
          [offeredServiceIds[0]]: offeredServiceEntities[offeredServiceIds[0]],
          [offeredServiceIds[1]]: offeredServiceEntities[offeredServiceIds[1]],
          [offeredServiceIds[2]]: offeredServiceEntities[offeredServiceIds[2]],
          [offeredServiceIds[3]]: offeredServiceEntities[offeredServiceIds[3]]
        }
      };
      const action = OfferedServiceServiceActions.addOfferedService({
        offeredService: offeredServices[4]
      });
      const state = fromOfferedService.reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('removeOfferedService', () => {
    it('should remove an offered service from the state', () => {
      const initialState: fromOfferedService.State = {
        ids: offeredServiceIds,
        entities: offeredServiceEntities
      };

      const expectedState: fromOfferedService.State = {
        ids: [
          offeredServiceIds[0],
          offeredServiceIds[1],
          offeredServiceIds[3],
          offeredServiceIds[4]
        ],
        entities: {
          [offeredServiceIds[0]]: offeredServiceEntities[offeredServiceIds[0]],
          [offeredServiceIds[1]]: offeredServiceEntities[offeredServiceIds[1]],
          [offeredServiceIds[3]]: offeredServiceEntities[offeredServiceIds[3]],
          [offeredServiceIds[4]]: offeredServiceEntities[offeredServiceIds[4]]
        }
      };

      const id = offeredServiceIds[2];
      const action = OfferedServiceServiceActions.removeOfferedService({
        id
      });
      const state = fromOfferedService.reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });

    it('should leave state as it is if offered service is not in state', () => {
      const initialState: fromOfferedService.State = {
        ids: offeredServiceIds,
        entities: offeredServiceEntities
      };

      const expectedState: fromOfferedService.State = initialState;
      const id = '1-4-MYB-PC';
      const action = OfferedServiceServiceActions.removeOfferedService({ id });
      const state = fromOfferedService.reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('updateValidFromValidity()', () => {
    it('should update valid from for offeredServices', () => {
      const initialState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          ...offeredServiceEntities
        }
      };

      const expectedState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          [offeredServiceIds[0]]: {
            ...offeredServiceEntities[offeredServiceIds[0]],
            validity: {
              validFrom: '2019-01-01'
            }
          },
          [offeredServiceIds[1]]: {
            ...offeredServiceEntities[offeredServiceIds[1]],
            validity: {
              validFrom: '2019-01-01'
            }
          },
          [offeredServiceIds[2]]: { ...offeredServiceEntities[offeredServiceIds[2]] },
          [offeredServiceIds[3]]: { ...offeredServiceEntities[offeredServiceIds[3]] },
          [offeredServiceIds[4]]: { ...offeredServiceEntities[offeredServiceIds[4]] }
        }
      };

      const action = OfferedServiceServiceActions.updateValidFromValidity({
        ids: ['GS0000001-1', 'GS0000001-2'],
        validFrom: '2019-01-01'
      });
      const state = fromOfferedService.reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('updateModelSeriesIds()', () => {
    it('should update modelSeriesIds', () => {
      const initialState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          ...offeredServiceEntities
        }
      };

      const expectedState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          ...offeredServiceEntities,
          [offeredServiceIds[0]]: {
            ...offeredServiceEntities[offeredServiceIds[0]],
            modelSeriesIds: ['W204']
          }
        }
      };

      const action = OfferedServiceServiceActions.updateModelSeriesIds({
        id: offeredServiceIds[0],
        modelSeriesIds: ['W204']
      });

      const state = fromOfferedService.reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('updateSeriesIds()', () => {
    it('should update seriesIds', () => {
      const initialState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          ...offeredServiceEntities
        }
      };

      const expectedState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          ...offeredServiceEntities,
          [offeredServiceIds[0]]: {
            ...offeredServiceEntities[offeredServiceIds[0]],
            seriesIds: [1, 2]
          }
        }
      };

      const action = OfferedServiceServiceActions.updateSeriesIds({
        id: offeredServiceIds[0],
        seriesIds: [1, 2]
      });

      const state = fromOfferedService.reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('updateValidUntilValidity()', () => {
    it('should update valid until for offeredServices', () => {
      const initialState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          ...offeredServiceEntities
        }
      };

      const expectedState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          [offeredServiceIds[0]]: {
            ...offeredServiceEntities[offeredServiceIds[0]],
            validity: {
              validUntil: '2019-01-01'
            }
          },
          [offeredServiceIds[1]]: {
            ...offeredServiceEntities[offeredServiceIds[1]],
            validity: {
              validUntil: '2019-01-01'
            }
          },
          [offeredServiceIds[2]]: { ...offeredServiceEntities[offeredServiceIds[2]] },
          [offeredServiceIds[3]]: { ...offeredServiceEntities[offeredServiceIds[3]] },
          [offeredServiceIds[4]]: { ...offeredServiceEntities[offeredServiceIds[4]] }
        }
      };

      const action = OfferedServiceServiceActions.updateValidUntilValidity({
        ids: ['GS0000001-1', 'GS0000001-2'],
        validUntil: '2019-01-01'
      });
      const state = fromOfferedService.reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('updateApplication', () => {
    it('should update application for offeredServices', () => {
      const initialState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          ...offeredServiceEntities
        }
      };

      const expectedState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          [offeredServiceIds[0]]: {
            ...offeredServiceEntities[offeredServiceIds[0]],
            validity: {
              application: true
            }
          },
          [offeredServiceIds[1]]: {
            ...offeredServiceEntities[offeredServiceIds[1]],
            validity: {
              application: true
            }
          },
          [offeredServiceIds[2]]: { ...offeredServiceEntities[offeredServiceIds[2]] },
          [offeredServiceIds[3]]: { ...offeredServiceEntities[offeredServiceIds[3]] },
          [offeredServiceIds[4]]: { ...offeredServiceEntities[offeredServiceIds[4]] }
        }
      };

      const action = OfferedServiceServiceActions.updateApplicationValidity({
        ids: ['GS0000001-1', 'GS0000001-2'],
        application: true
      });
      const state = fromOfferedService.reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('updateApplicationUntil', () => {
    it('should update application until for offeredServices', () => {
      const initialState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          ...offeredServiceEntities
        }
      };

      const expectedState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          [offeredServiceIds[0]]: {
            ...offeredServiceEntities[offeredServiceIds[0]],
            validity: {
              applicationValidUntil: '2019-01-01'
            }
          },
          [offeredServiceIds[1]]: {
            ...offeredServiceEntities[offeredServiceIds[1]],
            validity: {
              applicationValidUntil: '2019-01-01'
            }
          },
          [offeredServiceIds[2]]: { ...offeredServiceEntities[offeredServiceIds[2]] },
          [offeredServiceIds[3]]: { ...offeredServiceEntities[offeredServiceIds[3]] },
          [offeredServiceIds[4]]: { ...offeredServiceEntities[offeredServiceIds[4]] }
        }
      };

      const action = OfferedServiceServiceActions.updateApplicationUntilValidity({
        ids: ['GS0000001-1', 'GS0000001-2'],
        applicationValidUntil: '2019-01-01'
      });
      const state = fromOfferedService.reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('updateOfferedServiceValidity()', () => {
    it('should update offered service with empty validity', () => {
      const initialState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          ...offeredServiceEntities
        }
      };

      const expectedState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          [offeredServiceIds[0]]: { ...offeredServiceEntities[offeredServiceIds[0]] },
          [offeredServiceIds[1]]: { ...offeredServiceEntities[offeredServiceIds[1]] },
          [offeredServiceIds[2]]: {
            id: 'GS0000001-3',
            serviceId: 2,
            productCategoryId: 2,
            brandId: 'MB',
            productGroupId: 'PC'
          },
          [offeredServiceIds[3]]: { ...offeredServiceEntities[offeredServiceIds[3]] },
          [offeredServiceIds[4]]: { ...offeredServiceEntities[offeredServiceIds[4]] }
        }
      };

      const action = OfferedServiceServiceActions.updateValidity({
        validityChange: {
          ids: ['GS0000001-3'],
          validity: {}
        }
      });

      const state = fromOfferedService.reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });

    it('should update offered service with validity', () => {
      const initialState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          ...offeredServiceEntities
        }
      };

      const expectedState: fromOfferedService.State = {
        ids: [...offeredServiceIds],
        entities: {
          [offeredServiceIds[0]]: { ...offeredServiceEntities[offeredServiceIds[0]] },
          [offeredServiceIds[1]]: {
            ...offeredServiceEntities[offeredServiceIds[1]],
            validity: {
              application: true,
              applicationValidUntil: '2020-01-01',
              validFrom: '2020-01-02',
              validUntil: '2020-01-31'
            }
          },
          [offeredServiceIds[2]]: {
            ...offeredServiceEntities[offeredServiceIds[2]],
            validity: {
              application: true,
              applicationValidUntil: '2020-01-01',
              validFrom: '2020-01-02',
              validUntil: '2020-01-31'
            }
          },
          [offeredServiceIds[3]]: { ...offeredServiceEntities[offeredServiceIds[3]] },
          [offeredServiceIds[4]]: { ...offeredServiceEntities[offeredServiceIds[4]] }
        }
      };

      const action = OfferedServiceServiceActions.updateValidity({
        validityChange: {
          ids: ['GS0000001-3', 'GS0000001-2'],
          validity: {
            application: true,
            applicationValidUntil: '2020-01-01',
            validFrom: '2020-01-02',
            validUntil: '2020-01-31'
          }
        }
      });

      const state = fromOfferedService.reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });
  });
});
