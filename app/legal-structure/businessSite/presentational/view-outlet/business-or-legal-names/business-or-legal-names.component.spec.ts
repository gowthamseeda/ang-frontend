import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BusinessOrLegalNamesComponent } from './business-or-legal-names.component';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestingModule } from '../../../../../testing/testing.module';

@Component({
  template: '<gp-business-names></gp-business-names>'
})
class BusinessOrLegalNamesTestComponent {
  @ViewChild(BusinessOrLegalNamesComponent)
  public outletIdAndStatusComponent: BusinessOrLegalNamesComponent;
}

describe('BusinessOrLegalNamesComponent', () => {
  let component: BusinessOrLegalNamesTestComponent;
  let fixture: ComponentFixture<BusinessOrLegalNamesTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BusinessOrLegalNamesTestComponent],
        imports: [ReactiveFormsModule, TestingModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessOrLegalNamesTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
