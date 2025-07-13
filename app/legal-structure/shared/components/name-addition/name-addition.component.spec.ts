import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';

import { NameAdditionComponent } from './name-addition.component';

function getOutletFormMock() {
  return new FormBuilder().group({
    nameAddition: ''
  });
}

describe('NameAdditionComponent', () => {
  let component: NameAdditionComponent;
  let fixture: ComponentFixture<NameAdditionComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NameAdditionComponent, TranslatePipeMock],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NameAdditionComponent);
    component = fixture.componentInstance;
    component.parentForm = getOutletFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
