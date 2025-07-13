import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { MasterBrandService } from '../../../master/brand/master-brand/master-brand.service';
import { TestingModule } from '../../../testing/testing.module';

import { BrandCodeComponent } from './brand-code.component';
import { BrandCode } from './brand-code.model';
import { BrandCodeService } from './brand-code.service';

const brandCodes: BrandCode[] = [
  { brandCode: 'SMT', brandId: '123456' },
  { brandCode: 'MB', brandId: '123456' }
];
const sortedBrandCodes: BrandCode[] = [
  { brandCode: 'MB', brandId: '123456' },
  { brandCode: 'SMT', brandId: '123456' }
];

describe('BrandCodeComponent', () => {
  let component: BrandCodeComponent;
  let fixture: ComponentFixture<BrandCodeComponent>;
  let brandCodeServiceSpy: Spy<BrandCodeService>;
  let masterBrandSpy: Spy<MasterBrandService>;

  beforeEach(
    waitForAsync(() => {
      brandCodeServiceSpy = createSpyFromClass(BrandCodeService);
      masterBrandSpy = createSpyFromClass(MasterBrandService);

      TestBed.configureTestingModule({
        declarations: [BrandCodeComponent],
        imports: [
          TestingModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateFakeLoader
            }
          })
        ],
        providers: [
          TranslateService,
          { provide: BrandCodeService, useValue: brandCodeServiceSpy },
          { provide: MasterBrandService, useValue: masterBrandSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    brandCodeServiceSpy.get.nextWith(brandCodes);
    masterBrandSpy.sort.nextWith(sortedBrandCodes);

    fixture = TestBed.createComponent(BrandCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component.outletId = 'GS0000001';
      component.brandCodes = [];
      component.isLoading = true;
    });

    it('should init the brand codes', done => {
      component.ngOnChanges({});
      brandCodeServiceSpy.get.complete();
      expect(component.brandCodes).toEqual(sortedBrandCodes);
      expect(component.isLoading).toBeFalsy();
      done();
    });

    it('should call brand code service if brandCodesInput is undefined', () => {
      component.ngOnChanges({});
      expect(brandCodeServiceSpy.get).toHaveBeenCalled();
    });

    it('should call brand code service if some brandCodesInput brandId is empty', () => {
      component.brandCodesInput = [
        ...brandCodes,
        { brandId: '', brandCode: brandCodes[0].brandCode }
      ];
      component.ngOnChanges({});
      expect(brandCodeServiceSpy.get).toHaveBeenCalled();
    });

    it('should not call brand code service if brandCodesInput is present', () => {
      component.brandCodesInput = brandCodes;
      component.ngOnChanges({});
      expect(brandCodeServiceSpy.get).not.toHaveBeenCalled();
      expect(component.isLoading).toBeFalsy();
    });
  });

  it('should sort brand codes', () => {
    component.brandCodes = [];
    component.sortBrandCodes(brandCodes);
    expect(component.brandCodes).toMatchObject(sortedBrandCodes);
  });
});
