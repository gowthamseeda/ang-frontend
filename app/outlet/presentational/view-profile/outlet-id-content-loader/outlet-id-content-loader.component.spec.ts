import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutletIdContentLoaderComponent } from './outlet-id-content-loader.component';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestingModule } from '../../../../testing/testing.module';

@Component({
  template: '<gp-outlet-id-content-loader [isLoading]="isLoading"></gp-outlet-id-content-loader>'
})
class OutletIdContentLoaderTestComponent {
  @ViewChild(OutletIdContentLoaderComponent)
  public component = OutletIdContentLoaderComponent;
  isLoading: Boolean = true;
}

describe('OutletIdContentLoaderComponent', () => {
  let component: OutletIdContentLoaderTestComponent;
  let fixture: ComponentFixture<OutletIdContentLoaderTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletIdContentLoaderTestComponent],
        imports: [ReactiveFormsModule, TestingModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletIdContentLoaderTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
