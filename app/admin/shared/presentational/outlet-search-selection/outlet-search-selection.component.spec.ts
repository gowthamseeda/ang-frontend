import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SearchItem } from '../../../../search/models/search-item.model';
import { SearchResultMessage } from '../../../../search/search-result/search-result.component';
import { OutletResult } from '../../../../search/shared/outlet-result/outlet-result.model';
import { TestingModule } from '../../../../testing/testing.module';
import { GS0000022_outletDetailsMock } from '../../models/outlet.mock';
import { OutletDetails } from '../../models/outlet.model';
import { OutletSearchService } from '../../service/outlet-search.service';

import { OutletSearchSelectionComponent } from './outlet-search-selection.component';

class MockOutletSearchService {
  convertToOutletDetails(): OutletDetails {
    return GS0000022_outletDetailsMock;
  }
}

const searchItem: SearchItem<OutletResult> = {
  id: 'GS0000022',
  type: '',
  payload: {
    id: 'GS0000022',
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

describe('OutletSearchSelectionComponent', () => {
  let component: OutletSearchSelectionComponent;
  let fixture: ComponentFixture<OutletSearchSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutletSearchSelectionComponent],
      imports: [TestingModule],
      providers: [
        { provide: OutletSearchService, useClass: MockOutletSearchService },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn()
          }
        },
        MatDialog,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            outlets: GS0000022_outletDetailsMock,
            previousTitle: 'Search for previous outlet',
            currentTitle: 'Search for current outlet'
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletSearchSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('init', done => {
      jest.spyOn(component, 'initTitle');
      jest.spyOn(component, 'initSearchFieldInput');
      jest.spyOn(component, 'initSearchFieldSettings');
      jest.spyOn(component, 'filterExcludedOutletIds');

      component.ngOnInit();

      expect(component.outletType).toEqual(component.data.outlets);
      expect(component.initTitle).toHaveBeenCalled();
      expect(component.initSearchFieldInput).toHaveBeenCalled();
      expect(component.initSearchFieldSettings).toHaveBeenCalled();
      expect(component.filterExcludedOutletIds).toHaveBeenCalled();
      done();
    });
  });

  describe('initTitle()', () => {
    it('Display current title if isAddCurrentSelected is TRUE', done => {
      component.data.outlets.isAddCurrentSelected = true;
      component.data.outlets.isAddPreviousSelected = false;
      component.initTitle();

      expect(component.title).toEqual(component.data.currentTitle);
      done();
    });

    it('Display current title if isAddPreviousSelected is TRUE', done => {
      component.data.outlets.isAddCurrentSelected = false;
      component.data.outlets.isAddPreviousSelected = true;
      component.initTitle();

      expect(component.title).toEqual(component.data.previousTitle);
      done();
    });
  });

  describe('initSearchFieldInput()', () => {
    it('Set search field input if isAddPreviousSelected is true', done => {
      component.initSearchFieldInput();

      expect(component.searchFieldInput.placeHolderText).toEqual('ENTER_KEYWORDS_TO_FIND_OUTLET');
      expect(component.searchFieldInput.searchResultMessage).toEqual(
        new SearchResultMessage('OUTLET_FOUND', 'OUTLETS_FOUND')
      );
      done();
    });
  });

  describe('initSearchFieldSettings()', () => {
    it('Set search field setting', done => {
      component.initSearchFieldSettings();
      expect(component.searchFieldSettings.saveSearchQuery).toBeFalsy();
      done();
    });
  });

  describe('filterExcludedOutlets()', () => {
    it('Filter outlet ids without NULL value', done => {
      component.outletType = {
        isAddPreviousSelected: true,
        previous: GS0000022_outletDetailsMock,
        isAddCurrentSelected: false,
        current: null
      };

      component.filterExcludedOutletIds();
      expect(component.excludedOutletIds).toEqual(['GS0000022']);
      done();
    });
  });

  describe('searchItemRetrieved()', () => {
    it('isAddPreviousSelected is TRUE, current and previous are NULL', done => {
      jest.spyOn(component.dialogRef, 'close');

      component.outletType = {
        isAddPreviousSelected: true,
        previous: null,
        isAddCurrentSelected: false,
        current: null
      };

      component.searchItemRetrieved(searchItem);

      expect(component.outletType.previous?.outletId).toEqual(searchItem.id);
      expect(component.outletType.current).toBeNull();
      expect(component.outletType.isAddPreviousSelected).toBeTruthy();
      expect(component.outletType.isAddCurrentSelected).toBeFalsy();
      expect(component.dialogRef.close).toHaveBeenCalled();
      done();
    });

    it('isAddCurrentSelected is TRUE, current and previous are NULL', done => {
      jest.spyOn(component.dialogRef, 'close');

      component.outletType = {
        isAddPreviousSelected: false,
        previous: null,
        isAddCurrentSelected: true,
        current: null
      };

      component.searchItemRetrieved(searchItem);

      expect(component.outletType.current?.outletId).toEqual(searchItem.id);
      expect(component.outletType.previous).toBeNull();
      expect(component.outletType.isAddPreviousSelected).toBeFalsy();
      expect(component.outletType.isAddCurrentSelected).toBeTruthy();
      expect(component.dialogRef.close).toHaveBeenCalled();
      done();
    });
  });
});
