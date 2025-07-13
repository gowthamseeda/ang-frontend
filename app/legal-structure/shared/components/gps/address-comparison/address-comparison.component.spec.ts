import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';

import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';

import { AddressComparisonComponent } from './address-comparison.component';

describe('AddressComparisonComponent', () => {
  let component: AddressComparisonComponent;
  let fixture: ComponentFixture<AddressComparisonComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          AddressComparisonComponent,
          TranslatePipeMock,
          NgxPermissionsAllowStubDirective
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
