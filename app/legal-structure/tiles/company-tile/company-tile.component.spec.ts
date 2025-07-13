import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { of } from 'rxjs';

import { getCountryChMockWithTranslations } from '../../../geography/country/country.mock';
import { CountryService } from '../../../geography/country/country.service';
import { TestingModule } from '../../../testing/testing.module';
import { getOutletMock } from '../../shared/models/outlet.mock';
import { OutletService } from '../../shared/services/outlet.service';

import { CompanyTileComponent } from './company-tile.component';

export class TranslateServiceStub {
  public currentLang = 'de-CH';
  onLangChange: EventEmitter<any> = new EventEmitter();
  onTranslationChange: EventEmitter<any> = new EventEmitter();
  onDefaultLangChange: EventEmitter<any> = new EventEmitter();
  get() {
    return of({});
  }
  use() {
    return of({});
  }

  instant(arg) {
    if (arg === 'TILE_DETAILS_EDIT') {
      return 'EDIT DETAILS';
    }
    return 'SHOW DETAILS';
  }
}

describe('CompanyComponent', () => {
  let component: CompanyTileComponent;
  let fixture: ComponentFixture<CompanyTileComponent>;
  let outletServiceSpy: Spy<OutletService>;
  let countryServiceSpy: Spy<CountryService>;

  beforeEach(
    waitForAsync(() => {
      countryServiceSpy = createSpyFromClass(CountryService);
      outletServiceSpy = createSpyFromClass(OutletService);
      countryServiceSpy.get.nextWith(getCountryChMockWithTranslations());
      outletServiceSpy.getCompany.nextWith(getOutletMock());

      TestBed.configureTestingModule({
        declarations: [CompanyTileComponent, NgxPermissionsAllowStubDirective],
        imports: [
          ReactiveFormsModule,
          TestingModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateFakeLoader
            }
          }),
          NgxPermissionsModule.forRoot()
        ],
        providers: [
          { provide: OutletService, useValue: outletServiceSpy },
          { provide: CountryService, useValue: countryServiceSpy },
          { provide: TranslateService, useClass: TranslateServiceStub },
          NgxPermissionsService
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(CompanyTileComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get translated countryName', () => {
    component.countryName = 'Switzerland';
    component.getCompanyData('');
    fixture.detectChanges();
    expect(component.countryName).toBe('Schweiz');
  });
});
