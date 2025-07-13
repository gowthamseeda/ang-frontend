import { TestBed } from '@angular/core/testing';

import { MultiSelectDataService } from './multi-select-service-data.service';
import { MultiSelectMode } from '../models/multi-select.model';
import { OfferedServiceMock } from '../../offered-service/offered-service.mock';
import { MultiSelectOfferedServiceMock } from '../../offered-service/multi-select-offered-service.mock';

describe('multiSelectDataService', () => {
  let service: MultiSelectDataService;
  let offeredServices = OfferedServiceMock.asList();
  let multiSelectOfferedService = MultiSelectOfferedServiceMock.asList();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MultiSelectDataService]
    });
    service = TestBed.inject(MultiSelectDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('multiSelected', () => {
    it('should return data', done => {
      service.multiSelected.subscribe(data => {
        expect(data.targets).toEqual([]);
        expect(data.mode).toEqual(MultiSelectMode.EDIT);
      });
      done();
    });
  });

  describe('isTargetsEmpty', () => {
    it('should return true if targets are empty', done => {
      service.isTargetsEmpty.subscribe(data => {
        expect(data).toEqual(true);
      });
      done();
    });

    it('should return false if source with value', done => {
      service.addTarget(offeredServices[1]);
      service.isTargetsEmpty.subscribe(data => {
        expect(data).toEqual(false);
      });
      done();
    });
  });

  describe('updateMode', () => {
    it('should return COPY mode', done => {
      service.updateMode(MultiSelectMode.COPY);
      service.mode.subscribe(data => {
        expect(data).toEqual(MultiSelectMode.COPY);
      });
      done();
    });

    it('should return EDIT mode', done => {
      service.updateMode(MultiSelectMode.EDIT);
      service.mode.subscribe(data => {
        expect(data).toEqual(MultiSelectMode.EDIT);
      });
      done();
    });
  });

  describe('addTarget', () => {
    it('should add target', done => {
      service.addTarget(offeredServices[1]);

      service.multiSelected.subscribe(data => {
        expect(data.targets).toContain(offeredServices[1]);
      });

      done();
    });

    it('should not add target if already added', done => {
      service.addTarget(offeredServices[1]);
      service.addTarget(offeredServices[1]);

      service.multiSelected.subscribe(data => {
        expect(data.targets.length).toEqual(1);
      });

      done();
    });
  });

  it('should remove target', done => {
    service.addTarget(offeredServices[1]);
    service.removeTarget(offeredServices[1]);

    service.multiSelected.subscribe(data => {
      expect(data.targets.length).toEqual(0);
    });

    done();
  });

  describe('isTarget', () => {
    it('should check if target exist is true', done => {
      service.addTarget(offeredServices[1]);

      service.isTarget('gs002').subscribe(isTarget => {
        expect(isTarget).toBeTruthy();
      });

      done();
    });

    it('should check if target exist is false', done => {
      service.isTarget('gs002').subscribe(isTarget => {
        expect(isTarget).toBeFalsy();
      });

      done();
    });
  });

  describe('hoveredService', () => {
    it('should return null on init', () => {
      service.hoveredService.subscribe(it => {
        expect(it).toBeNull();
      });
    });
  });

  describe('updateHoveredService', () => {
    it('should update the hoveredService property', () => {
      service.updateHoveredService(120);

      service.hoveredService.subscribe(it => {
        expect(it).toBe(120);
      });
    });

    it('should update the hoveredService property to null', () => {
      service.updateHoveredService();

      service.hoveredService.subscribe(it => {
        expect(it).toBeNull();
      });
    });
  });

  describe('multiSelectOfferedServiceList', () => {
    it('should return data', done => {
      service.multiSelectOfferedServiceList.subscribe(data => {
        expect(data.offeredServiceAddedList).toEqual([]);
        expect(data.offeredServiceRemovedList).toEqual([]);
      });
      done();
    });
  });

  describe('MultiSelectedOfferedService operation', () => {
    it('should add offeredService to addedList', done => {
      service.addOfferedServiceToList(multiSelectOfferedService[1]);

      service.multiSelectOfferedServiceList.subscribe(data => {
        expect(data.offeredServiceAddedList).toContain(multiSelectOfferedService[1]);
      });

      done();
    });

    it('should add offeredService to removedList', done => {
      service.removeOfferedServiceFromList(multiSelectOfferedService[1]);

      service.multiSelectOfferedServiceList.subscribe(data => {
        expect(data.offeredServiceRemovedList).toContain(multiSelectOfferedService[1]);
      });

      done();
    });

    it('should not add offeredService if addedList already added', done => {
      service.addOfferedServiceToList(multiSelectOfferedService[1]);
      service.addOfferedServiceToList(multiSelectOfferedService[1]);

      service.multiSelectOfferedServiceList.subscribe(data => {
        expect(data.offeredServiceAddedList.length).toEqual(1);
      });

      done();
    });

    it('should not add offeredService if removedList already added', done => {
      service.removeOfferedServiceFromList(multiSelectOfferedService[1]);
      service.removeOfferedServiceFromList(multiSelectOfferedService[1]);

      service.multiSelectOfferedServiceList.subscribe(data => {
        expect(data.offeredServiceRemovedList.length).toEqual(1);
      });

      done();
    });

    it(
      'should remove invalid offeredService from both list if ' +
        'removed list already added that invalid offeredService',
      done => {
        service.multiSelectOfferedServiceList.subscribe(data => {
          data.offeredServiceRemovedList.push(multiSelectOfferedService[1]);
          service.addOfferedServiceToList(multiSelectOfferedService[1]);

          service.multiSelectOfferedServiceList.subscribe(data => {
            expect(data.offeredServiceAddedList.length).toEqual(0);
          });

          service.multiSelectOfferedServiceList.subscribe(data => {
            expect(data.offeredServiceRemovedList.length).toEqual(0);
          });

          done();
        });
      }
    );

    it(
      'should add invalid offeredService to addedList and ' +
        'should add valid offeredService to removedList' +
        'if add invalid offeredService and remove valid offeredService',
      done => {
        service.multiSelectOfferedServiceList.subscribe(data => {
          let invalidOfferedService = multiSelectOfferedService[1];
          let validOfferedService = multiSelectOfferedService[2];

          data.offeredServiceRemovedList.push(validOfferedService);
          service.addOfferedServiceToList(invalidOfferedService);
          service.removeOfferedServiceFromList(validOfferedService);

          service.multiSelectOfferedServiceList.subscribe(data => {
            expect(data.offeredServiceAddedList.length).toEqual(1);
            expect(data.offeredServiceAddedList).toContain(invalidOfferedService);
          });

          service.multiSelectOfferedServiceList.subscribe(data => {
            expect(data.offeredServiceRemovedList.length).toEqual(1);
            expect(data.offeredServiceRemovedList).toContain(validOfferedService);
          });

          done();
        });
      }
    );
  });
});
