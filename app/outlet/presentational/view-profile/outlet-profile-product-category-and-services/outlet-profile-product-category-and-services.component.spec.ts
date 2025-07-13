import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutletProfileProductCategoryAndServicesComponent } from './outlet-profile-product-category-and-services.component';

describe('OutletProfileProductCategoryAndServicesComponent', () => {
  let component: OutletProfileProductCategoryAndServicesComponent;
  let fixture: ComponentFixture<OutletProfileProductCategoryAndServicesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletProfileProductCategoryAndServicesComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletProfileProductCategoryAndServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
