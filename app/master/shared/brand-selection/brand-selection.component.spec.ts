import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BrandMock } from '../../../services/brand/brand.mock';
import { BrandService } from '../../../services/brand/brand.service';
import { CompModule } from '../../../shared/components/components.module';
import { TestingModule } from '../../../testing/testing.module';
import { BrandSelectionComponent } from './brand-selection.component';


describe('BrandSelectionComponent', () => {
  let component: BrandSelectionComponent;
  let fixture: ComponentFixture<BrandSelectionComponent>;
  let brandServiceSpy: Spy<BrandService>;
  const brandsMock = BrandMock.asList();
  beforeEach(
    waitForAsync(() => {
      brandServiceSpy = createSpyFromClass(BrandService);
      TestBed.configureTestingModule({
        imports: [
          CompModule,
          TestingModule,
          MatSelectModule,
          MatChipsModule,
          ReactiveFormsModule,
          NoopAnimationsModule
        ],
        declarations: [BrandSelectionComponent],
        providers: [{ provide: BrandService, useValue: brandServiceSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(BrandSelectionComponent);
    component = fixture.componentInstance;
    brandServiceSpy.getAll.nextWith(brandsMock);
    brandServiceSpy.getFilteredBrands.nextWith(brandsMock);
    component.placeholder = 'CHOOSE_BRANDS';
    component.fControl = new FormControl([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    const brandsForUserDataRestrictions = brandsMock.filter(
      brand => brand.id === 'MB' || brand.id === 'SMT'
    );

    beforeEach(() => {
      brandServiceSpy.getFilteredBrands.nextWith(brandsForUserDataRestrictions);
    });

    it('should load all brands', () => {
      expect(component.allBrands).toEqual(brandsMock);
    });
  });
});
