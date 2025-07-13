import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';

import { AssignableType, Label } from './label.model';
import { LabelService } from './label.service';

export function getLabel1(): Label {
  return new Label(1, 'Authorized Dealer', undefined, ['BRAND'], ['CH'], ['MB', 'SMT']);
}

export function getLabel2(): Label {
  return new Label(2, 'Daimler Dealer', undefined, ['BRAND'], ['GB'], ['SMT']);
}

export function getLabels(): Label[] {
  return [getLabel1(), getLabel2()];
}

describe('LabelService', () => {
  let service: LabelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, LabelService]
    });

    service = TestBed.inject(LabelService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllAssignable', () => {
    it('should get the labels of a type', done => {
      service.getAllAssignable(AssignableType.BRAND).subscribe((labels: Label[]) => {
        expect(labels).toEqual(getLabels());
        done();
      });
    });

    it('should get no labels of unknown type', done => {
      service.getAllAssignable('something').subscribe((labels: Label[]) => {
        expect(labels).toEqual([]);
        done();
      });
    });
  });
});
