import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { BrandMock } from '../../../services/brand/brand.mock';
import { BrandService } from '../../../services/brand/brand.service';

import { TranslatedBrandFlagComponent } from './translated-brand-flag.component';

describe('TranslatedFilterComponent', () => {
  const brandsMock = BrandMock.asList();
  let component: TranslatedBrandFlagComponent;
  let fixture: ComponentFixture<TranslatedBrandFlagComponent>;
  let brandServiceSpy: Spy<BrandService>;

  beforeEach(
    waitForAsync(() => {
      brandServiceSpy = createSpyFromClass(BrandService);
      brandServiceSpy.getAll.nextWith(brandsMock);

      TestBed.configureTestingModule({
        declarations: [TranslatedBrandFlagComponent],
        providers: [{ provide: BrandService, useValue: brandServiceSpy }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatedBrandFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load all brands', () => {
      expect(component.allBrands).toEqual(brandsMock);
    });
  });

  describe('brandBy', () => {
    it('should load all brands', () => {
      const expectedBrand = component.allBrands[0];
      expect(component.brandBy('brands_MB')).toEqual(expectedBrand);
    });
  });
});
