import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';

import { PoBoxComponent } from './po-box.component';

function getPOBoxFormMock() {
  return new FormBuilder().group({
    poBox: new FormBuilder().group({
      number: '',
      zipCode: '',
      city: ''
    })
  });
}

describe('PoBoxComponent', () => {
  let component: PoBoxComponent;
  let fixture: ComponentFixture<PoBoxComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PoBoxComponent, TranslatePipeMock],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoBoxComponent);
    component = fixture.componentInstance;
    component.parentForm = getPOBoxFormMock();
    component.dataNotification = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
