import { TestBed } from '@angular/core/testing';

import { AssignedBrandLabelTableService } from './assigned-brand-label-table.service';

describe('AssignedBrandLabelTableService', () => {
  let service: AssignedBrandLabelTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssignedBrandLabelTableService]
    });

    service = TestBed.inject(AssignedBrandLabelTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveAssignedLabels', () => {
    it('should send the assigned brand label saved true to the saveAssignedLabels Observable', done => {
      service.saveAssignedLabels().subscribe(value => {
        expect(value).toEqual(true);
        done();
      });
      service.assignedLabelsSaved(true);
    });
  });
});
