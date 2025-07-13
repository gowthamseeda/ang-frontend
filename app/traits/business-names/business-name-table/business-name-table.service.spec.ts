import { TestBed } from '@angular/core/testing';

import { BusinessNameTableService } from './business-name-table.service';

describe('BusinessNameTableService', () => {
  let service: BusinessNameTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusinessNameTableService]
    });

    service = TestBed.inject(BusinessNameTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('namesSaved', () => {
    it('should send the business names saved true the saveNames Observable', done => {
      service.saveNames().subscribe(value => {
        expect(value).toEqual(true);
        done();
      });
      service.namesSaved(true);
    });
  });
});
