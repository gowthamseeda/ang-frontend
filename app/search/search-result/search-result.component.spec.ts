import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';

import { LegalStructureRoutingService } from '../../legal-structure/legal-structure-routing.service';
import { SearchItem } from '../models/search-item.model';
import { getAutoLangSearchItemMock } from '../models/search.mock';
import { OutletResult } from '../shared/outlet-result/outlet-result.model';

import { SearchResultComponent } from './search-result.component';

class LegalStructureRoutingServiceStub {
  outletIdChanges = new BehaviorSubject<string>('');
}

describe('SearchResultComponent', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;
  const legalStructureRoutingServiceStub = new LegalStructureRoutingServiceStub();
  const searchResultMessage = { singular: 'COMPANY_FOUND', plural: 'COMPANIES_FOUND' };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SearchResultComponent],
        imports: [TranslateModule.forRoot()],
        providers: [
          { provide: LegalStructureRoutingService, useValue: legalStructureRoutingServiceStub }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    component.searchItems = of([getAutoLangSearchItemMock()] as SearchItem<OutletResult>[]);
    component.checkedSearchItems = [getAutoLangSearchItemMock()] as SearchItem<OutletResult>[];
    component.searchResultMessage = searchResultMessage;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should get the outlet id when it changes', () => {
      legalStructureRoutingServiceStub.outletIdChanges.next('GS0000001');
      expect(component.selectedOutletId).toEqual('GS0000001');

      legalStructureRoutingServiceStub.outletIdChanges.next('GS0000002');
      expect(component.selectedOutletId).toEqual('GS0000002');
    });
  });
});
