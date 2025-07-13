import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestingModule } from '../../../../../testing/testing.module';
import { BusinessNamesContentLoaderComponent } from './business-names-content-loader.component';

@Component({
  template:
    '<gp-business-names-content-loader [isLoading]="isLoading"></gp-business-names-content-loader>'
})
class BusinessNamesContentLoaderTestComponent {
  @ViewChild(BusinessNamesContentLoaderComponent)
  public outletIdAndStatusComponent: BusinessNamesContentLoaderComponent;
  isLoading: Boolean = true;
}

describe('BusinessNamesContentLoaderComponents', () => {
  let component: BusinessNamesContentLoaderTestComponent;
  let fixture: ComponentFixture<BusinessNamesContentLoaderTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BusinessNamesContentLoaderTestComponent],
        imports: [ReactiveFormsModule, TestingModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessNamesContentLoaderTestComponent);
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
