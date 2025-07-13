import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { UserService } from '../../../../iam/user/user.service';
import { SearchFilterFlag, SearchFilterTag } from '../../../../search/models/search-filter.model';
import { SearchItem } from '../../../../search/models/search-item.model';
import { SearchResultMessage } from '../../../../search/search-result/search-result.component';
import { SearchFieldInput } from '../../../../search/searchfield/searchfield-input.model';
import { SearchFieldSettings } from '../../../../search/searchfield/searchfield-settings.model';
import { OutletResult } from '../../../../search/shared/outlet-result/outlet-result.model';

import { DealerGroupHeadquarterSelectionComponent } from './dealer-group-headquarter-selection.component';

class MatDialogRefStub {
  close() {}
}

describe('DealerGroupHeadquarterSelectionComponent', () => {
  let userServiceSpy: Spy<UserService>;
  let component: DealerGroupHeadquarterSelectionComponent;
  let fixture: ComponentFixture<DealerGroupHeadquarterSelectionComponent>;
  let matDialogRefStub = new MatDialogRefStub();

  beforeEach(waitForAsync(() => {
    userServiceSpy = createSpyFromClass(UserService);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MatDialogModule],
      declarations: [DealerGroupHeadquarterSelectionComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: UserService, useValue: userServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    userServiceSpy.getCountryRestrictions.nextWith([]);

    fixture = TestBed.createComponent(DealerGroupHeadquarterSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init search field input', () => {
      expect(component.searchFieldInput).toEqual(
        new SearchFieldInput({
          placeHolderText: 'ENTER_KEYWORDS_TO_FIND_OUTLET',
          predefinedSearchFilters: [
            new SearchFilterFlag('registeredOffice'),
            new SearchFilterFlag('active'),
            new SearchFilterTag('type=BusinessSite')
          ],
          searchResultMessage: new SearchResultMessage('OUTLET_FOUND', 'OUTLETS_FOUND')
        })
      );
    });

    it('should init search field input with country restrictions', () => {
      userServiceSpy.getCountryRestrictions.nextWith(['DE', 'MY']);

      expect(component.searchFieldInput).toEqual(
        new SearchFieldInput({
          placeHolderText: 'ENTER_KEYWORDS_TO_FIND_OUTLET',
          predefinedSearchFilters: [
            new SearchFilterFlag('registeredOffice'),
            new SearchFilterFlag('active'),
            new SearchFilterTag('type=BusinessSite'),
            new SearchFilterTag('countryId=DE MY')
          ],
          searchResultMessage: new SearchResultMessage('OUTLET_FOUND', 'OUTLETS_FOUND')
        })
      );
    });

    it('should init search field settings', () => {
      expect(component.searchFieldSettings).toEqual(
        new SearchFieldSettings({
          saveSearchQuery: false,
          contextId: 'AddDealerGroupHeadquarter'
        })
      );
    });
  });

  describe('searchItemRetrieved', () => {
    it('should close dialog with dealer group headquarter', () => {
      const searchItem: SearchItem<OutletResult> = {
        id: 'GS00000001',
        type: '',
        payload: {
          id: 'GS00000001',
          legalName: 'Malaysia MB 1',
          companyId: 'GC00000001',
          nameAddition: 'Malaysia MB 1',
          affiliate: true,
          active: true,
          activeOrInPlanning: true,
          undefined: false,
          street: 'Some Street',
          streetNumber: '5',
          city: 'Puchong',
          zipCode: '12345',
          addressAddition: '',
          district: '',
          province: '',
          state: '',
          poBoxZipCode: '12345',
          poBoxCity: 'Puchong',
          poBoxNumber: '1',
          alias: '',
          brandCodes: [],
          mainOutlet: true,
          subOutlet: false,
          distributionLevels_applicant: false,
          distributionLevels_manufacturer: false,
          distributionLevels_retailer: true,
          distributionLevels_wholesaler: false,
          registeredOffice: true,
          countryId: 'MY',
          countryName: 'Malaysia',
          businessNames: [],
          offeredServices: [],
          notification: null,
          notificationType: ''
        }
      };

      jest.spyOn(component.dialogRef, 'close');

      component.searchItemRetrieved(searchItem);
      expect(component.dialogRef.close).toHaveBeenCalledWith(component.dealerGroupHeadquarter);
    });
  });

  describe('searchItemsReset', () => {
    it('should set headquarter to undefined', () => {
      expect(component.dealerGroupHeadquarter).toBeUndefined();
    });
  });
});
