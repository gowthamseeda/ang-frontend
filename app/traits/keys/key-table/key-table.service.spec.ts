import { TestBed } from '@angular/core/testing';

import { KeyTableService } from './key-table.service';

describe('KeyTableService', () => {
  let service: KeyTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyTableService]
    });

    service = TestBed.inject(KeyTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('keysSaved', () => {
    it('should send the true to the saveKeys Observable', done => {
      service.saveKeys().subscribe(value => {
        expect(value).toBeTruthy();
        done();
      });
      service.keysSaved(true);
    });
  });
});
