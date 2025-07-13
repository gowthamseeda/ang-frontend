import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { ServiceService } from '../../services/service/services/service.service';
import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';

import { GeneralGroupsService } from './general-groups.service';
import { generalGroupMockForCreate, generalGroupsMock } from './model/general-groups.mock';

describe('GeneralGroupsService', () => {
  let generalGroupsService: GeneralGroupsService;
  let serviceServiceSpy: Spy<ServiceService>;

  beforeEach(() => {
    serviceServiceSpy = createSpyFromClass(ServiceService, ['fetchBy', 'selectBy']);
    serviceServiceSpy.fetchBy.mockReturnValue('');
    serviceServiceSpy.selectBy.mockReturnValue(of(''));

    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ApiService,
        LoggingService,
        GeneralGroupsService,
        {
          provide: ServiceService,
          useValue: serviceServiceSpy
        }
      ]
    });
    generalGroupsService = TestBed.inject(GeneralGroupsService);
  });

  it('should create', () => {
    expect(generalGroupsService).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all general groups from the structure contract', done => {
      generalGroupsService.getAll().subscribe(generalGroups => {
        expect(generalGroups).toEqual(generalGroupsMock);
        done();
      });
    });
  });

  describe('get()', () => {
    it('should get a specific general group from the structure contract', done => {
      generalGroupsService.get('GG00000001').subscribe(generalGroups => {
        expect(generalGroups).toEqual(generalGroupsMock.generalGroups[0]);
        done();
      });
    });
  });

  describe('create()', () => {
    it('should create a general group from the structure contract', done => {
      generalGroupsService.create(generalGroupMockForCreate).subscribe(response => {
        expect(response.id).toEqual('GG00000005');
        done();
      });
    });
  });

  describe('update()', () => {
    it('should update a general groups from the structure contract', done => {
      let updated = false;
      const generalGroupToUpdate = {
        name: 'Bell Truck & Van',
        active: true,
        countryId: 'CH',
        members: ['GS00000002'],
        successorGroupId: 'GG00000002'
      };

      generalGroupsService.update('GG00000001', generalGroupToUpdate).subscribe(() => {
        updated = true;
        done();
      });

      expect(updated).toBeTruthy();
    });
  });
});
