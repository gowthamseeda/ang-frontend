import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { PipesModule } from '../../../shared/pipes/pipes.module';
import { SearchFilter } from '../../models/search-filter.model';
import {
    getSearchFilterFlagRegisteredOfficeMock,
    getSearchFilterTagLegalNameDaimlerMock,
    getSearchFilterValueBusinessSiteMock,
    getSearchFilterValueDaimlerMock
} from '../../models/search.mock';

import { SearchFilterChipListComponent } from './search-filter-chip-list.component';

describe('SearchFilterChipListComponent', () => {
  const searchFilterValueDaimler = getSearchFilterValueDaimlerMock();
  const searchFilterValueBusinessSite = getSearchFilterValueBusinessSiteMock();
  const searchFilterTagLegalNameDaimler = getSearchFilterTagLegalNameDaimlerMock();
  const searchFilterFlagRegisteredOffice = getSearchFilterFlagRegisteredOfficeMock();
  const searchFiltersMock: SearchFilter[] = [
    searchFilterValueBusinessSite,
    searchFilterTagLegalNameDaimler,
    searchFilterFlagRegisteredOffice
  ];

  describe('SearchFilterChipListComponent', () => {
    let fixture: ComponentFixture<SearchFilterChipListComponent>;
    let component: SearchFilterChipListComponent;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [TranslateModule.forRoot({}), PipesModule],
          declarations: [SearchFilterChipListComponent],
          providers: [],
          schemas: [NO_ERRORS_SCHEMA]
        });

        TestBed.compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(SearchFilterChipListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('Select and deselect search tags', () => {
      describe('removeSearchFilter', () => {
        it('should remove searchFilter from selected search filter list', () => {
          component.searchFilters = searchFiltersMock;
          component.removeSearchFilter(searchFilterValueDaimler);
          fixture.detectChanges();
          expect(component.searchFilters).not.toContain(searchFilterValueDaimler);
        });
      });

      describe('removeNameFromSearchFilter', () => {
        const removeTagResponseMock: SearchFilter[] = [
          searchFilterTagLegalNameDaimler,
          searchFilterFlagRegisteredOffice
        ];

        it('should remove name from selected search filter', () => {
          component.searchFilters = removeTagResponseMock;
          component.removeNameFromSearchFilter(searchFilterTagLegalNameDaimler);
          fixture.detectChanges();
          expect(component.searchFilters[0].name).toBeUndefined();
        });

        it('should only remove respective value from selected search tag', () => {
          component.searchFilters = removeTagResponseMock;
          component.removeNameFromSearchFilter(searchFilterTagLegalNameDaimler);
          fixture.detectChanges();
          expect(component.searchFilters[1]).toEqual(searchFilterFlagRegisteredOffice);
        });
      });
    });
  });
});
