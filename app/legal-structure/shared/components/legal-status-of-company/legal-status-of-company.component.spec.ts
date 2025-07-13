import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';

import { LegalStatusOfCompanyComponent } from './legal-status-of-company.component';

function getOutletFormMock() {
  return new FormBuilder().group({
    affiliate: false
  });
}

describe('LegalStatusOfCompanyComponent', () => {
  let component: LegalStatusOfCompanyComponent;
  let fixture: ComponentFixture<LegalStatusOfCompanyComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LegalStatusOfCompanyComponent, TranslatePipeMock],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalStatusOfCompanyComponent);
    component = fixture.componentInstance;
    component.parentForm = getOutletFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
