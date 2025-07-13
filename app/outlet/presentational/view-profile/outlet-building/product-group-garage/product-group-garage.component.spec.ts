import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductGroupGarageComponent } from './product-group-garage.component';

describe('ProductGroupGarageComponent', () => {
  let component: ProductGroupGarageComponent;
  let fixture: ComponentFixture<ProductGroupGarageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ProductGroupGarageComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupGarageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
