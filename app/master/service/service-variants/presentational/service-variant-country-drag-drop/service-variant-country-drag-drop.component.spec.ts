import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

import { SortingService } from '../../../../../shared/services/sorting/sorting.service';
import { TestingModule } from '../../../../../testing/testing.module';
import { MasterCountryMock } from '../../../../country/master-country/master-country.mock';
import { MasterCountry } from '../../../../country/master-country/master-country.model';
import { MasterCountryService } from '../../../../country/master-country/master-country.service';

import { ServiceVariantCountryDragDropComponent } from './service-variant-country-drag-drop.component';

class MockCountryService {
  getAll(): Observable<MasterCountry[]> {
    return of(MasterCountryMock.asList());
  }
}

function getFormMock(): FormGroup {
  return new FormBuilder().group({
    searchAvailable: '',
    searchRestrict: ''
  });
}

describe('ServiceVariantCountryDragDropComponent', () => {
  const countryMock = MasterCountryMock.asList();

  let component: ServiceVariantCountryDragDropComponent;
  let fixture: ComponentFixture<ServiceVariantCountryDragDropComponent>;
  let sortingServiceSpy: Spy<SortingService>;

  beforeEach(async () => {
    sortingServiceSpy = createSpyFromClass(SortingService);

    await TestBed.configureTestingModule({
      declarations: [ServiceVariantCountryDragDropComponent],
      imports: [TestingModule, OverlayModule, DragDropModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: MasterCountryService, useClass: MockCountryService },
        { provide: SortingService, useValue: sortingServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    TestBed.inject(MasterCountryService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceVariantCountryDragDropComponent);
    component = fixture.componentInstance;
    component.searchFormGroup = getFormMock();
    component.countryRestrictions = [countryMock[0].id];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('initAvailableCountries and initRestrictedCountries functions are called', () => {
      component.ngOnChanges();
      expect(component.initAvailableCountries).toBeTruthy();
      expect(component.initRestrictedCountries).toBeTruthy();
    });
  });

  describe('initAvailableCountries()', () => {
    it('filter available countries in ordering', () => {
      component.initAvailableCountries();
      const result = component.availableCountries.filter(
        country => !component.countryRestrictions.includes(country.id)
      );
      expect(result).toContainEqual(countryMock[1]);
    });
  });

  describe('initRestrictedCountries()', () => {
    it('filter restricted countries in ordering', () => {
      component.initRestrictedCountries();
      const result = component.restrictCountries.filter(country =>
        component.countryRestrictions.includes(country.id)
      );
      expect(result).toContainEqual(countryMock[0]);
    });
  });
});
