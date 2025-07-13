import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestingModule } from '../../../../../testing/testing.module';
import { OutletStatusContentLoaderComponent } from './outlet-id-and-status-content-loader.component';

@Component({
  template:
    '<gp-outlet-id-and-status-content-loader [isLoading]="isLoading"></gp-outlet-id-and-status-content-loader>'
})
class OutletStatusContentLoaderTestComponent {
  @ViewChild(OutletStatusContentLoaderComponent)
  public outletIdAndStatusComponent: OutletStatusContentLoaderComponent;
  isLoading: Boolean = true;
}

describe('OutletStatusContentLoaderComponent', () => {
  let component: OutletStatusContentLoaderTestComponent;
  let fixture: ComponentFixture<OutletStatusContentLoaderTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletStatusContentLoaderTestComponent],
        imports: [ReactiveFormsModule, TestingModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletStatusContentLoaderTestComponent);
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
