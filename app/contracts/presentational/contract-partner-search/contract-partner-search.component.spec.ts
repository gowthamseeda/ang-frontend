import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { ContractPartnerSearchComponent } from './contract-partner-search.component';
import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { SearchFieldSettings } from '../../../search/searchfield/searchfield-settings.model';

describe('ContractPartnerSearchComponent', () => {
  let component: ContractPartnerSearchComponent;
  let fixture: ComponentFixture<ContractPartnerSearchComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [OverlayModule],
        declarations: [ContractPartnerSearchComponent, TranslatePipeMock],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractPartnerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize SearchFieldSettings', () => {
      expect(component.searchFieldSettings).toBeInstanceOf(SearchFieldSettings);
    });
  });

  describe('ngOnChanges', () => {
    it('should initialize default search filters', () => {
      component.countryRestrictions = [];
      component.ngOnChanges();

      expect(component.searchFilters.length).toBe(3);
    });

    it('should initialize search filters including country restriction', () => {
      component.countryRestrictions = ['DE'];
      component.ngOnChanges();

      expect(component.searchFilters.length).toBe(4);
    });
  });

  describe('getSearchFieldSettings', () => {
    it('should return context-based search field settings for a contract partner', () => {
      component.contextId = 'ContractPartner-0';
      const expected = {
        searchResultItemClickAction: 'singleselect',
        contextId: 'ContractPartner-0',
        saveSearchQuery: true
      };

      expect(component.getSearchFieldSettings()).toEqual(expected);
    });
  });

  describe('emitSelectedContractPartner', () => {
    it('should emit a selected contract partner', () => {
      jest.spyOn(component.contractPartnerIdSelect, 'emit');
      component.emitSelectedContractPartnerId({
        id: 'GS1',
        type: 'BusinessSite',
        payload: null
      });

      expect(component.contractPartnerIdSelect.emit).toHaveBeenCalledWith('GS1');
    });
  });

  describe('deleteContractPartner', () => {
    it('should emit a contract pratner to be deleted', () => {
      jest.spyOn(component.contractPartnerDelete, 'emit');
      component.emitDeletedContractPartner('GS000001');

      expect(component.contractPartnerDelete.emit).toHaveBeenCalledWith('GS000001');
    });
  });
});
