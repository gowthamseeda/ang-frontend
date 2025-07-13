import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestingModule } from '../../../../../testing/testing.module';
import { AddressLinesContentLoaderComponent } from './address-lines-content-loader.component';

@Component({
  template:
    '<gp-address-lines-content-loader [isLoading]="isLoading"></gp-address-lines-content-loader>'
})
class AddressLinesContentLoaderTestComponent {
  @ViewChild(AddressLinesContentLoaderComponent)
  public outletIdAndStatusComponent: AddressLinesContentLoaderComponent;
  isLoading: Boolean = true;
}

describe('AddressLinesContentLoaderComponent', () => {
  let component: AddressLinesContentLoaderTestComponent;
  let fixture: ComponentFixture<AddressLinesContentLoaderTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AddressLinesContentLoaderTestComponent],
        imports: [ReactiveFormsModule, TestingModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressLinesContentLoaderTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get isLoading state form parent', () => {
    expect(component.isLoading).toBeTruthy();
  });
});
