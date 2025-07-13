import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';

import { PoBoxZipCodeComponent } from './po-box-zip-code.component';

function getPOBoxFormMock() {
  return new FormBuilder().group({
    poBox: new FormBuilder().group({
      zipCode: ''
    })
  });
}

describe('PoBoxZipCodeComponent', () => {
  let component: PoBoxZipCodeComponent;
  let fixture: ComponentFixture<PoBoxZipCodeComponent>;

  beforeEach(
    waitForAsync(() => {

      TestBed.configureTestingModule({
        declarations: [PoBoxZipCodeComponent, TranslatePipeMock],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoBoxZipCodeComponent);
    component = fixture.componentInstance;
    component.poBoxForm = getPOBoxFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
