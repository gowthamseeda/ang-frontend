import { TestBed } from '@angular/core/testing';

import { TaskMock } from '../../task.mock';
import { DataCluster, Task } from '../../task.model';

import { DataClusterLinkOutService } from './data-cluster-link-out.service';
import { AGGREGATE_NAMES } from '../../../shared/model/constants';

describe('DataClusterLinkOutService', () => {
  let service: DataClusterLinkOutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataClusterLinkOutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('routerLink', () => {
    it('should leave routerLink undefined when scope is unknown', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: 'UNKNOWN'
      };
      const link = service.getRouterLink(task);

      expect(link).toBeFalsy();
    });

    it('should set routerLink according to base data', () => {
      const task: Task = {
        ...TaskMock.asList()[0]
      };
      const expected = `../outlet/${task.businessSiteId}/edit`;
      const link = service.getRouterLink(task);

      expect(link).toEqual(expected);
    });

    it('should set routerLink according to legal', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.LEGAL_TAX_NO
      };
      const expected = `../outlet/${task.businessSiteId}/legal`;
      const link = service.getRouterLink(task);

      expect(link).toEqual(expected);
    });

    it('should set routerLink to legal if aggregate name contains legal when getRouterLink', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        aggregateName: 'CompanyLegalInfo'
      };
      const expected = `../outlet/${task.businessSiteId}/legal`;
      const link = service.getRouterLink(task);

      expect(link).toEqual(expected);
    });

    it('should set routerLink to edit if aggregate name contains additional when getRouterLink', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        aggregateName: 'additionalAddressAddition'
      };
      const expected = `../outlet/${task.businessSiteId}/edit`;
      const link = service.getRouterLink(task);

      expect(link).toEqual(expected);
    });

    it('should set routerLink to general communication page if aggregateName matches when getRouterLink', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        aggregateName: AGGREGATE_NAMES.GENERAL_COMMUNICATION_DATA
      };
      const expected = `../outlet/${task.businessSiteId}/general-communication`;
      const link = service.getRouterLink(task);

      expect(link).toEqual(expected);
    });
  });

  describe('routerFragment', () => {
    it('should set fragment according to address', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BASE_DATA_ADDRESS
      };
      const expected = 'address';
      const link = service.getRouterFragment(task.dataCluster);

      expect(link).toEqual(expected);
    });

    it('should set fragment for name addition to address', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BASE_DATA_NAME_ADDITION
      };
      const expected = 'address';
      const link = service.getRouterFragment(task.dataCluster);

      expect(link).toEqual(expected);
    });

    it('should set fragment for state and province to address', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BASE_DATA_STATE_AND_PROVINCE
      };
      const expected = 'address';
      const link = service.getRouterFragment(task.dataCluster);

      expect(link).toEqual(expected);
    });

    it('should set fragment for street to address', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BASE_DATA_ADDRESS_STREET
      };
      const expected = 'address';
      const link = service.getRouterFragment(task.dataCluster);

      expect(link).toEqual(expected);
    });

    it('should set fragment for number to address', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BASE_DATA_ADDRESS_NUMBER
      };
      const expected = 'address';
      const link = service.getRouterFragment(task.dataCluster);

      expect(link).toEqual(expected);
    });

    it('should set fragment for address addition to address', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BASE_DATA_ADDRESS_ADDRESS_ADDITION
      };
      const expected = 'address';
      const link = service.getRouterFragment(task.dataCluster);

      expect(link).toEqual(expected);
    });

    it('should set fragment for zip code to address', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BASE_DATA_ADDRESS_ZIP_CODE
      };
      const expected = 'address';
      const link = service.getRouterFragment(task.dataCluster);

      expect(link).toEqual(expected);
    });

    it('should set fragment for city to address', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BASE_DATA_ADDRESS_CITY
      };
      const expected = 'address';
      const link = service.getRouterFragment(task.dataCluster);

      expect(link).toEqual(expected);
    });

    it('should set fragment for district to address', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BASE_DATA_ADDRESS_DISTRICT
      };
      const expected = 'address';
      const link = service.getRouterFragment(task.dataCluster);

      expect(link).toEqual(expected);
    });

    it('should set fragment for state to address', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BASE_DATA_ADDRESS_STATE
      };
      const expected = 'address';
      const link = service.getRouterFragment(task.dataCluster);

      expect(link).toEqual(expected);
    });

    it('should set fragment for province to address', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BASE_DATA_ADDRESS_PROVINCE
      };
      const expected = 'address';
      const link = service.getRouterFragment(task.dataCluster);

      expect(link).toEqual(expected);
    });

    it('should set fragment according to additional address', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BASE_DATA_ADDITIONAL_ADDRESS
      };
      const expected = 'additionalAddress';
      const link = service.getRouterFragment(task.dataCluster);

      expect(link).toEqual(expected);
    });

    it('should set fragment according to poBox', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BASE_DATA_PO_BOX
      };
      const expected = 'poBox';
      const link = service.getRouterFragment(task.dataCluster);

      expect(link).toEqual(expected);
    });

    it('should set fragment according to gpsCoordinates', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BASE_DATA_GPS
      };
      const expected = 'gps';
      const link = service.getRouterFragment(task.dataCluster);

      expect(link).toEqual(expected);
    });

    it('should set fragment according to business name', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BUSINESS_NAME
      };
      const expected = 'businessNames';
      const link = service.getRouterFragment(task.dataCluster);

      expect(link).toEqual(expected);
    });
    it('should set fragment according to gps', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BUSINESS_NAME,
        aggregateField: 'gpsLatitude'
      };
      const expected = 'gps';
      const link = service.getRouterFragment(task.dataCluster, task.aggregateField);

      expect(link).toEqual(expected);
    });
  });
});
