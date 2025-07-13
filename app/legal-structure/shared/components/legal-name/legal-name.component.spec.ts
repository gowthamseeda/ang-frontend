import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { OutletService } from '../../services/outlet.service';

import { LegalNameComponent } from './legal-name.component';

function getOutletFormMock() {
  return new FormBuilder().group({
    legalName: ''
  });
}

describe('LegalNameComponent ', () => {
  let component: LegalNameComponent;
  let fixture: ComponentFixture<LegalNameComponent>;

  let outletServiceSpy: Spy<OutletService>;

  beforeEach(
    waitForAsync(() => {
      outletServiceSpy = createSpyFromClass(OutletService);

      TestBed.configureTestingModule({
        declarations: [LegalNameComponent, TranslatePipeMock],
        providers: [{ provide: OutletService, useValue: outletServiceSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalNameComponent);
    component = fixture.componentInstance;
    component.parentForm = getOutletFormMock();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isEditable should be false when editing legal name is not allowed', () => {
    outletServiceSpy.isLegalNameEditableInCountry.mockReturnValue(false);
    component.registeredOffice = false;
    fixture.detectChanges();
    expect(component.isControlEditable()).toBeFalsy();
  });

  it('isLegalNameEditable should be true when editing legal name is allowed', () => {
    outletServiceSpy.isLegalNameEditableInCountry.mockReturnValue(true);
    fixture.detectChanges();
    expect(component.isControlEditable()).toBeTruthy();
  });
});
