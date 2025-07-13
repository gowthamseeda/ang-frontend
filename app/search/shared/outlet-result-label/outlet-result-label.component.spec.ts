import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OutletResultLabelComponent } from './outlet-result-label.component';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import {
  getAffiliateSearchItemMock,
  getAutoFrickerGS3SearchItemMock,
  getAutoFrickerGS4SearchItemMock,
  getAutoLangSearchItemMock,
  getBusinessSiteWithDistributionLevelSearchItemMock,
  getMainBusinessSiteSearchItemMock,
  getSubBusinessSiteSearchItemMock
} from '../../models/search.mock';
import { TestingModule } from '../../../testing/testing.module';
import { SearchItem } from '../../models/search-item.model';

@Component({
  template: '<gp-outlet-result-label [searchItem]="searchItem"></gp-outlet-result-label>'
})
class TestComponent {
  @ViewChild(OutletResultLabelComponent)
  public outletResultLabelComponent: OutletResultLabelComponent;
  searchItem = new SearchItem();
}

describe('OutletResultLabelComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TestingModule],
        declarations: [OutletResultLabelComponent, TestComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('registeredOffice', () => {
    component.searchItem = getAutoLangSearchItemMock();
    fixture.detectChanges();

    expect(component.outletResultLabelComponent.labels.length).toEqual(1);
    expect(component.outletResultLabelComponent.labels).toContain('RO_LABEL');
  });

  it('mainOutlet', () => {
    component.searchItem = getMainBusinessSiteSearchItemMock();
    fixture.detectChanges();

    expect(component.outletResultLabelComponent.labels.length).toEqual(1);
    expect(component.outletResultLabelComponent.labels).toContain('MAIN_LABEL');
  });

  it('subOutlet', () => {
    component.searchItem = getSubBusinessSiteSearchItemMock();
    fixture.detectChanges();

    expect(component.outletResultLabelComponent.labels.length).toEqual(1);
    expect(component.outletResultLabelComponent.labels).toContain('SUB_LABEL');
  });

  it('affiliate', () => {
    component.searchItem = getAffiliateSearchItemMock();
    fixture.detectChanges();

    expect(component.outletResultLabelComponent.labels.length).toEqual(1);
    expect(component.outletResultLabelComponent.labels).toContain('AFFILIATE_LABEL');
  });

  describe('inactive flag', () => {
    it('show inactive flag', () => {
      component.searchItem = getAutoFrickerGS4SearchItemMock();
      fixture.detectChanges();

      expect(component.outletResultLabelComponent.inactive).toBeFalsy();
    });

    it('hide inactive flag', () => {
      component.searchItem = getAutoFrickerGS3SearchItemMock();
      fixture.detectChanges();

      expect(component.outletResultLabelComponent.inactive).toBeTruthy();
    });
  });

  it('assignedDistributionLevels', () => {
    component.searchItem = getBusinessSiteWithDistributionLevelSearchItemMock();
    fixture.detectChanges();

    expect(component.outletResultLabelComponent.labels).toContain(
      'DISTRIBUTION_LEVEL_RETAILER_LABEL'
    );
    expect(component.outletResultLabelComponent.labels).not.toContain(
      'DISTRIBUTION_LEVEL_WHOLESALER_LABEL'
    );
  });
});
