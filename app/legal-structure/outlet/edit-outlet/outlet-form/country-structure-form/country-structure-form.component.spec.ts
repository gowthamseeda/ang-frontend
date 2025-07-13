import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { CountryStructureDescription } from '../../../../../structures/country-structure-description/model/country-structure-description.model';
import { CountryStructureDescriptionService } from '../../../../../structures/country-structure-description/service/country-structure-description.service';
import { CountryStructureService } from '../../../../../structures/country-structure/service/country-structure.service';
import { TestingModule } from '../../../../../testing/testing.module';

import { CountryStructureFormComponent } from './country-structure-form.component';

describe('CountryStructureFormComponent', () => {
  let component: CountryStructureFormComponent;
  let fixture: ComponentFixture<CountryStructureFormComponent>;
  let countryStructureDescriptionService: CountryStructureDescriptionService;
  let countryStructureService: CountryStructureService;
  const mockData: CountryStructureDescription[] = [
    {
      countryId: 'DE',
      id: 1,
      name: 'description1',
      structures: []
    }
  ];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CountryStructureFormComponent],
        providers: [
          {
            provide: CountryStructureDescriptionService,
            useValue: {
              getAll: jest.fn(),
              fetchAllForCountry: jest.fn()
            }
          },
          {
            provide: CountryStructureService,
            useValue: {
              getCountryStructureIdBy: jest.fn(),
              setCountryStructureIdFor: jest.fn()
            }
          }
        ],
        imports: [TestingModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    countryStructureDescriptionService = TestBed.inject(CountryStructureDescriptionService);
    jest.spyOn(countryStructureDescriptionService, 'getAll').mockReturnValue(of(mockData));

    countryStructureService = TestBed.inject(CountryStructureService);
    jest.spyOn(countryStructureService, 'getCountryStructureIdBy').mockReturnValue(of(undefined));

    fixture = TestBed.createComponent(CountryStructureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('shows gp-structure-component', () => {
    const countryStructureComp: HTMLElement = fixture.nativeElement.querySelector(
      'gp-country-structure'
    );
    expect(countryStructureComp).toBeTruthy();
  });

  test('does not show gp-structure-component if no data', () => {
    component.countryStructureDescriptions = of([]);
    fixture.detectChanges();

    const countryStructureComp: HTMLElement = fixture.nativeElement.querySelector(
      'gp-country-structure'
    );
    expect(countryStructureComp).toBeFalsy();
  });

  test('should fetch data if country id changes', () => {
    component.countryId = 'DE';
    expect(countryStructureDescriptionService.fetchAllForCountry).toHaveBeenCalledWith('DE');
  });
});
