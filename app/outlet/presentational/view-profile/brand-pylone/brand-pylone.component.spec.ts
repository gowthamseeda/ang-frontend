import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrandPyloneComponent } from './brand-pylone.component';

@Component({
  template: '<gp-brand-pylone [brandIds]="brands"></gp-brand-pylone>'
})
class BrandPyloneTestComponent {
  @ViewChild(BrandPyloneComponent)
  public chipsComponent: BrandPyloneComponent;
  brands: string[] = [];
}

describe('BrandPyloneComponent', () => {
  let component: BrandPyloneTestComponent;
  let fixture: ComponentFixture<BrandPyloneTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BrandPyloneTestComponent, BrandPyloneComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandPyloneTestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  test('should init with 3 blocks if there is no brand', () => {
    component.brands = [];
    fixture.detectChanges();

    expect(component.chipsComponent.brandIds).toHaveLength(3);
  });

  test('should init with 3 blocks if there are less than 3 brands', () => {
    component.brands = ['MB', 'SMT'];
    fixture.detectChanges();

    expect(component.chipsComponent.brandIds).toHaveLength(3);
  });

  test('should init with 3 blocks if there are 3 (or 4 or 5) brands', () => {
    component.brands = ['MB', 'SMT', 'FUSO'];
    fixture.detectChanges();

    expect(component.chipsComponent.brandIds).toHaveLength(3);
  });

  test('should init with 5 blocks if there are more than 5 brands', () => {
    component.brands = ['MB', 'SMT', 'FUSO', 'BAB', 'MYB', 'EQ'];
    fixture.detectChanges();

    expect(component.chipsComponent.brandIds).toHaveLength(5);
  });
});
