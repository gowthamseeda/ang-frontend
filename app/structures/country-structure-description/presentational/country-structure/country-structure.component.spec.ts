import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { TranslateDataPipe } from '../../../../shared/pipes/translate-data/translate-data.pipe';
import { UserSettings } from '../../../../user-settings/user-settings/model/user-settings.model';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';
import {
  CountryStructureDescription,
  CountryStructureDescriptionStructure
} from '../../model/country-structure-description.model';
import { getCountryStructureDescription_DE_Regions_Areas_Markets } from '../../model/country-structure-description.mock';

import { CountryStructureComponent } from './country-structure.component';

describe('CountryStructureComponent', () => {
  let component: CountryStructureComponent;
  let fixture: ComponentFixture<CountryStructureComponent>;
  let userSettingsServiceSpy: UserSettingsService;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;

  const countryStructureDescriptions = getCountryStructureDescription_DE_Regions_Areas_Markets();
  const parentForm = new FormGroup({});
  const userSettings: UserSettings = {
    languageId: 'de-DE'
  };

  beforeEach(
    waitForAsync(() => {
      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
      userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
      userAuthorizationServiceSpy.verify.nextWith(true);

      TestBed.configureTestingModule({
        declarations: [CountryStructureComponent, TranslateDataPipe],
        providers: [
          {
            provide: UserSettingsService,
            useValue: {
              get: jest.fn()
            }
          },
          {
            provide: UserAuthorizationService,
            useValue: { isAuthorizedFor: userAuthorizationServiceSpy }
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
      userSettingsServiceSpy = TestBed.inject(UserSettingsService);
      jest.spyOn(userSettingsServiceSpy, 'get').mockReturnValue(of(userSettings));
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryStructureComponent);
    component = fixture.componentInstance;
    component.parentForm = parentForm;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.parentForm = parentForm;
      component.countryStructureDescriptions = countryStructureDescriptions;
      fixture.detectChanges();
    });

    test('should not select any options if no selection is available', () => {
      component.selectedCountryStructureId = '';
      fixture.detectChanges();
      component.ngOnInit();

      expect(component.countryStructureHierarchyFilteredByLeaf[0].selectedStructureId).toBe('');
    });

    test('should select correct options when selection is available', () => {
      component.selectedCountryStructureId = '2';
      fixture.detectChanges();
      component.ngOnInit();

      expect(component.countryStructureHierarchyFilteredByLeaf[0].selectedStructureId).toBe('1');
      expect(component.countryStructureHierarchyFilteredByLeaf[1].selectedStructureId).toBe('2');
      expect(component.countryStructureHierarchyFilteredByLeaf[2].selectedStructureId).toBe('');
    });

    test('should set languageId', done => {
      component.ngOnInit();

      component.userSettings.subscribe(settings => {
        expect(settings.languageId).toEqual(userSettings.languageId);
        done();
      });
    });
  });

  describe('countryStructureValueChanged', () => {
    beforeEach(() => {
      component.parentForm = parentForm;
      component.countryStructureDescriptions = countryStructureDescriptions;
      fixture.detectChanges();
    });

    test('should update selected country structure id when selection is changed', () => {
      component.onSelectionChanged(0, '2');
      expect(component.countryStructureFormControl.value).toBe('2');
    });

    test('should update available options when first selection is changed', () => {
      const firstDescription: CountryStructureDescription = countryStructureDescriptions[0];
      const secondDescription: CountryStructureDescription = countryStructureDescriptions[1];
      const selected: CountryStructureDescriptionStructure = firstDescription.structures[1];
      component.onSelectionChanged(0, selected.id);

      expect(component.countryStructureHierarchyFilteredByLeaf[1].structures).toStrictEqual(
        secondDescription.structures.filter(structure => structure.parentId === selected.id)
      );
    });

    test('should update available options when second selection is changed', () => {
      const secondDescription: CountryStructureDescription = countryStructureDescriptions[1];
      const thirdDescription: CountryStructureDescription = countryStructureDescriptions[2];
      const selected: CountryStructureDescriptionStructure = secondDescription.structures[1];
      component.onSelectionChanged(1, selected.id);

      expect(component.countryStructureHierarchyFilteredByLeaf[2].structures).toStrictEqual(
        thirdDescription.structures.filter(structure => structure.parentId === selected.id)
      );
    });

    test('should mark form dirty when selection is changed', () => {
      component.onSelectionChanged(1, '2');
      expect(component.countryStructureFormControl.dirty).toBe(true);
    });
  });
});
