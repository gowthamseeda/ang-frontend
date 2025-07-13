import { serviceCommunicationDataMock } from './communication-data.mock';
import { CommunicationData } from './communication-data.model';
import { CommunicationFieldType } from './communication-field-type';
import { communicationFieldMock } from './communication-field.mock';
import { offeredServiceMock } from './offered-service.mock';
import hasEqualFieldsAndValues = CommunicationData.hasEqualFieldsAndValues;
import filterByQueryParams = CommunicationData.filterByQueryParams;
import filterByCommunicationFieldType = CommunicationData.filterByCommunicationFieldType;
import groupByOfferedServiceId = CommunicationData.groupByOfferedServiceId;

describe('CommunicationData', () => {
  describe('groupByOfferedServiceId', () => {
    it('group communication data by offered service ID', () => {
      const result = groupByOfferedServiceId([
        serviceCommunicationDataMock[0],
        serviceCommunicationDataMock[1],
        serviceCommunicationDataMock[2]
      ]);
      const expected = {
        'GS00000001-1': [serviceCommunicationDataMock[0], serviceCommunicationDataMock[1]],
        'GS20000001-10': [serviceCommunicationDataMock[2]]
      };
      expect(result).toEqual(expected);
    });
  });

  describe('hasEqualFieldsAndValues', () => {
    it('should return true for equal communication fields and values', () => {
      const a = [serviceCommunicationDataMock[0], serviceCommunicationDataMock[1]];
      const b = [serviceCommunicationDataMock[0], serviceCommunicationDataMock[1]];

      expect(hasEqualFieldsAndValues(a, b)).toBeTruthy();
    });

    it('should return false for any unequal communication field or value', () => {
      const someCommunicationData = {
        offeredServiceId: 'GS00000001-1',
        communicationFieldId: 'URL',
        value: 'differentUrl'
      };
      const a = [serviceCommunicationDataMock[0], serviceCommunicationDataMock[1]];
      const b = [serviceCommunicationDataMock[0], someCommunicationData];

      expect(hasEqualFieldsAndValues(a, b)).toBeFalsy();
    });
  });

  describe('filterByQueryParams', () => {
    it('filter communication data by query params', () => {
      const result = filterByQueryParams({ serviceId: 120, productCategoryId: 1 })([
        serviceCommunicationDataMock,
        [offeredServiceMock[0], offeredServiceMock[1], offeredServiceMock[2]]
      ]);
      expect(result).toEqual([serviceCommunicationDataMock[0], serviceCommunicationDataMock[1]]);
    });
  });

  describe('filterByCommunicationFieldType', () => {
    it('filter communication data by communication field type', () => {
      const result = filterByCommunicationFieldType(CommunicationFieldType.STANDARD)([
        serviceCommunicationDataMock,
        communicationFieldMock
      ]);
      expect(result).toEqual([
        serviceCommunicationDataMock[0],
        serviceCommunicationDataMock[1],
        serviceCommunicationDataMock[2]
      ]);
    });
  });
});
