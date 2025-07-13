import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SearchFilterTag } from '../../../../search/models/search-filter.model';
import { SearchResultMessage } from '../../../../search/search-result/search-result.component';
import { OutletResult } from '../../../../search/shared/outlet-result/outlet-result.model';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';

import { OutletSelectionComponent } from './outlet-selection.component';

const businessSiteId = 'GS0000001';
const expectedSearchFieldInput = {
  placeHolderText: 'ENTER_KEYWORDS_TO_FIND_OUTLET',
  predefinedSearchFilters: [new SearchFilterTag('type=BusinessSite')],
  searchResultMessage: new SearchResultMessage('OUTLET_FOUND', 'OUTLETS_FOUND')
};
const expectedSearchFieldSettings = {
  searchResultItemClickAction: 'singleselect',
  saveSearchQuery: false,
  contextId: 'AddOutletRelationship'
};

describe('OutletSelectionComponent', () => {
  let component: OutletSelectionComponent;
  let fixture: ComponentFixture<OutletSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutletSelectionComponent, TranslatePipeMock],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn()
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    component.searchFieldInput = { searchResultMessage: new SearchResultMessage('', '') };
    component.searchFieldSettings = {};

    component.ngOnInit();

    expect(component.searchFieldInput).toMatchObject(expectedSearchFieldInput);
    expect(component.searchFieldSettings).toMatchObject(expectedSearchFieldSettings);
  });

  it('should handle on search item retrieved', () => {
    const spy = jest.spyOn(component.dialogRef, 'close');
    component.searchItemRetrieved({ id: businessSiteId, type: '', payload: {} as OutletResult });
    expect(spy).toHaveBeenCalledWith(businessSiteId);
  });
});
