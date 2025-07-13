import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';

import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { ServiceFilterCriteria } from '../../models/service-table-row.model';
import { ServiceTableFilterService } from '../../services/service-table-filter.service';

import { ServiceFilterDialogComponent } from './service-filter-dialog.component';

function getFormMock() {
  return new UntypedFormBuilder().group({
    isOfferedService: false
  });
}

class MockServiceTableFilterService {
  get filterCriteria(): Observable<ServiceFilterCriteria> {
    return of({
      isOfferedService: {
        value: false,
        isEnabled: false
      }
    });
  }
  get pristineFilterCriteria(): Observable<ServiceFilterCriteria> {
    return of({
      isOfferedService: {
        value: true,
        isEnabled: false
      }
    });
  }
}
class MockOfferedServiceService {
  isEmpty(): Observable<boolean> {
    return of(true);
  }
}

describe('ServiceFilterDialogComponent', () => {
  let component: ServiceFilterDialogComponent;
  let fixture: ComponentFixture<ServiceFilterDialogComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceFilterDialogComponent, TranslatePipeMock],
      providers: [
        UntypedFormBuilder,
        { provide: MatDialogRef, useValue: {} },
        { provide: ServiceTableFilterService, useClass: MockServiceTableFilterService },
        { provide: OfferedServiceService, useClass: MockOfferedServiceService }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    TestBed.inject(ServiceTableFilterService);
    TestBed.inject(OfferedServiceService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceFilterDialogComponent);
    component = fixture.componentInstance;
    component.serviceFilterFormGroup = getFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('init form group', () => {
      component.ngOnInit();
      const isOfferedService = component.serviceFilterFormGroup.controls['isOfferedService'];
      expect(isOfferedService.enabled).toBeFalsy();
      expect(component.serviceFilterFormGroup).toBeTruthy();
    });
  });
});
