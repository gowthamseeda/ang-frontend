import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutletProfileProductCategoryAndServicesLoaderComponent } from './outlet-profile-product-category-and-services-loader.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OutletProfileProductCategoryAndServicesLoaderComponent', () => {
  let component: OutletProfileProductCategoryAndServicesLoaderComponent;
  let fixture: ComponentFixture<OutletProfileProductCategoryAndServicesLoaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletProfileProductCategoryAndServicesLoaderComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletProfileProductCategoryAndServicesLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
