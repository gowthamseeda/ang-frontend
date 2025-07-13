import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutletProfileProductCategoriesComponent } from './outlet-profile-product-categories.component';

describe('OutletProfileProductCategoriesComponent', () => {
  let component: OutletProfileProductCategoriesComponent;
  let fixture: ComponentFixture<OutletProfileProductCategoriesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletProfileProductCategoriesComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletProfileProductCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
