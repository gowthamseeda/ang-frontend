import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgStringPipesModule } from 'ngx-pipes';
import { Subscription } from 'rxjs';

import { UserService } from '../../iam/user/user.service';
import { MasterCountryService } from '../../master/country/master-country/master-country.service';
import { MatomoEventTracker, SearchProperties } from '../../shared/matomo/event-tracker.model';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { AppStateService } from '../../shared/services/state/app-state-service';
import { TestingModule } from '../../testing/testing.module';
import { UserSettingsService } from '../../user-settings/user-settings/services/user-settings.service';
import { FilterOption, TypedFilterOption } from '../models/filter-option.model';
import { FilterType } from '../models/filter-type.model';
import { SearchFilter, SearchFilterTag } from '../models/search-filter.model';
import { SearchItem } from '../models/search-item.model';
import {
  getAutoLangSearchItemMock,
  getFilterOptionCountryIdChMock,
  getFilterOptionLegalNameMock,
  getFilterOptionRegisteredOfficeMock,
  getSearchFilterFlagRegisteredOfficeMock,
  getSearchFilterTagLegalNameDaimlerMock,
  getSearchFilterValueDaimlerMock,
  getTypedFilterOptionBusinessSiteMock,
  getTypedFilterOptionLegalNameDaimlerMock,
  getTypedFilterOptionValueDaimlerMock,
  getTypedFlagFilterMock
} from '../models/search.mock';
import { SearchItemResponse, SearchService } from '../search.service';
import { OutletResult } from '../shared/outlet-result/outlet-result.model';
import { SearchFilterChipListComponent } from '../shared/search-filter-chip-list/search-filter-chip-list.component';

import { SearchFieldSettings } from './searchfield-settings.model';
import { SearchFieldComponent } from './searchfield.component';

describe('SearchFieldComponent', () => {
  const filterOptionLegalName = getFilterOptionLegalNameMock();
  const filterOptionRegisteredOffice = getFilterOptionRegisteredOfficeMock();
  const filterOptionCountryIdCh = getFilterOptionCountryIdChMock();
  const searchFilterOptionsMock: FilterOption[] = [
    filterOptionLegalName,
    filterOptionRegisteredOffice,
    filterOptionCountryIdCh
  ];
  const searchFilterValueDaimler = getSearchFilterValueDaimlerMock();
  const searchFilterTagLegalNameDaimler = getSearchFilterTagLegalNameDaimlerMock();
  const searchFilterFlagRegisteredOffice = getSearchFilterFlagRegisteredOfficeMock();
  const typedTagFilterOptionsMock: TypedFilterOption[] = [
    getTypedFilterOptionBusinessSiteMock(),
    getTypedFilterOptionLegalNameDaimlerMock(),
    getTypedFilterOptionValueDaimlerMock()
  ];
  const typedFlagFilterOptionsMock: TypedFilterOption[] = [getTypedFlagFilterMock()];
  const autoLangSearchItemMock = getAutoLangSearchItemMock();
  const searchItemsMock: SearchItemResponse = {
    total: 50,
    searchItems: [autoLangSearchItemMock] as SearchItem<OutletResult>[]
  };
  let searchServiceSpy: Spy<SearchService>;
  let appStateServiceSpy: Spy<AppStateService>;
  let userServiceSpy: Spy<UserService>;
  let userSettingsSpy: Spy<UserSettingsService>;
  let matomoEventTrackerSpy: Spy<MatomoEventTracker>;

  let masterCountryServiceSpy: Spy<MasterCountryService>;

  function createSearchFieldComponent(): ComponentFixture<SearchFieldComponent> {
    searchServiceSpy = createSpyFromClass(SearchService);
    appStateServiceSpy = createSpyFromClass(AppStateService);
    userServiceSpy = createSpyFromClass(UserService);
    userSettingsSpy = createSpyFromClass(UserSettingsService);
    matomoEventTrackerSpy = createSpyFromClass(MatomoEventTracker);
    masterCountryServiceSpy = createSpyFromClass(MasterCountryService);

    searchServiceSpy.searchTopMatches.nextWith(searchFilterOptionsMock);
    searchServiceSpy.searchTagNamesFilter.nextWith(typedTagFilterOptionsMock);
    searchServiceSpy.searchFlagNamesFilter.nextWith(typedFlagFilterOptionsMock);
    searchServiceSpy.search.nextWith(searchItemsMock);
    userServiceSpy.getRoles.nextWith([]);

    TestBed.configureTestingModule({
      imports: [
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatProgressBarModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({}),
        TestingModule,
        NgStringPipesModule,
        PipesModule
      ],
      declarations: [SearchFieldComponent, SearchFilterChipListComponent],
      providers: [
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: AppStateService, useValue: appStateServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: UserSettingsService, useValue: userSettingsSpy },
        { provide: MatomoEventTracker, useValue: matomoEventTrackerSpy },
        { provide: MasterCountryService, useValue: masterCountryServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    TestBed.compileComponents();

    return TestBed.createComponent(SearchFieldComponent);
  }

  describe('Searchfield component', () => {
    let fixture: ComponentFixture<SearchFieldComponent>;
    let component: SearchFieldComponent;
    let searchField: any;
    let searchButton: any;

    beforeEach(() => {
      fixture = createSearchFieldComponent();
      component = fixture.componentInstance;
      component.settings = new SearchFieldSettings({ saveSearchQuery: false });
      component.predefinedSearchFilters = [];
      fixture.detectChanges();

      searchField = component.searchForm.controls['searchField'];
      searchButton = fixture.debugElement.query(By.css('button'));
    });

    it('should create', () => {
      expect(component).toBeTruthy();
      expect(searchField.value).toEqual('');
      expect(searchButton.nativeElement.disabled).toBeTruthy();
    });

    describe('search filter save/restore', () => {
      it('should restore a saved search filter', () => {
        appStateServiceSpy.get.mockImplementation((key: string) =>
          key === 'selectedSearchFilters' ? [searchFilterValueDaimler] : ''
        );

        component.settings.saveSearchQuery = true;
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.selectedSearchFilters).toEqual([searchFilterValueDaimler]);
      });

      it('should restore a saved search value', () => {
        appStateServiceSpy.get.mockImplementation((key: string) =>
          key === 'searchValue' ? 'My search value' : []
        );

        component.settings.saveSearchQuery = true;
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.tagValue).toEqual('My search value');
      });

      it('should save search filter', fakeAsync(() => {
        const referenceValue = (searchFilterValueDaimler as SearchFilterTag).matchExact(true);

        component.settings.saveSearchQuery = true;
        searchField.setValue('Daimler');
        component.onTopMatchesItemSelect(referenceValue.value ? referenceValue.value : '');
        tick(300);
        expect(appStateServiceSpy.save).toHaveBeenCalledWith('selectedSearchFilters', [
          referenceValue
        ]);
      }));

      it('should save search value', fakeAsync(() => {
        component.settings.saveSearchQuery = true;
        searchField.setValue('Auto');
        tick(300);
        expect(appStateServiceSpy.save).toHaveBeenCalledWith('searchValue', 'Auto');
      }));
    });

    describe('top matches loading', () => {
      it('should load top matches after entering 3 characters and add it to suggestion list', fakeAsync(() => {
        searchField.setValue('Auto');
        tick(300);
        expect(searchServiceSpy.searchTopMatches).toHaveBeenCalled();
        expect(component.sortedTopMatches.length).toBe(searchFilterOptionsMock.length);
      }));
    });

    describe('search()', () => {
      it('should get the top matches from the service', waitForAsync(() => {
        component.tagValue = 'C';
        component.search();
        expect(component.sortedTopMatches.length).toEqual(searchFilterOptionsMock.length);
      }));

      it('should filter the search filters from the service if the input value is equal to the search filter values', waitForAsync(() => {
        component.tagValue = 'ch';
        component.search();
        expect(component.sortedTopMatches.length).toBe(2);
      }));

      it('should get the search items from the service', waitForAsync(() => {
        component.tagValue = 'CH';
        component.search();
        expect(component.searchItems.getValue()).toEqual(searchItemsMock.searchItems);
      }));

      it('should get the total number of search items from the service', waitForAsync(() => {
        component.tagValue = 'CH';
        component.search();
        expect(component.total).toEqual(searchItemsMock.total);
      }));

      it('should exclude search items', waitForAsync(() => {
        component.tagValue = 'CH';
        component.excludedSearchItems = [autoLangSearchItemMock.id];
        component.search();
        expect(component.total).toEqual(49);
        expect(component.searchItems.getValue().map(searchItem => searchItem.id)).not.toContain(
          autoLangSearchItemMock.id
        );
      }));

      it('should send simple search string to matomo', fakeAsync(() => {
        searchField.setValue('Daimler');
        tick(300);

        expect(matomoEventTrackerSpy.trackSiteSearch).toHaveBeenCalledWith(
          new SearchProperties('Daimler []', 'Main Search', 50)
        );
      }));

      it('should send simple search string to matomo', fakeAsync(() => {
        userServiceSpy.getRoles.nextWith(['role1', 'role2']);
        searchField.setValue('Daimler');
        tick(300);

        expect(matomoEventTrackerSpy.trackSiteSearch).toHaveBeenCalledWith(
          new SearchProperties('Daimler [role1,role2]', 'Main Search', 50)
        );
      }));

      it('should send simple search string to matomo', fakeAsync(() => {
        searchField.setValue('Daimler');
        component.onTopMatchesItemSelect(
          searchFilterValueDaimler.value ? searchFilterValueDaimler.value : ''
        );
        tick(300);

        expect(matomoEventTrackerSpy.trackSiteSearch).toHaveBeenCalledWith(
          new SearchProperties('(Daimler) []', 'Main Search', 50)
        );
      }));
    });

    describe('showResults()', () => {
      beforeEach(() => {
        component.selectedSearchFilters = [new SearchFilter(FilterType.TAG, '', 'Chosen filter')];
      });

      it('should show results when filters are selected', () => {
        expect(component.showSearchResults).toBeTruthy();
      });

      it('should hide results when no filters are selected', () => {
        component.selectedSearchFilters = [];
        expect(component.showSearchResults).toBeFalsy();
      });

      it('should show results when search is completed', () => {
        component.searchBusinessSitesSubscription = new Subscription();
        component.searchBusinessSitesSubscription.closed = true;
        expect(component.showSearchResults).toBeTruthy();
      });

      it('should hide results when search is in progress', () => {
        component.searchBusinessSitesSubscription = new Subscription();
        expect(component.showSearchResults).toBeFalsy();
      });

      it('should show results when lazy loading is in progress', () => {
        component.searchBusinessSitesSubscription = new Subscription();
        component.currentPage = 1;
        expect(component.showSearchResults).toBeTruthy();
      });
    });

    describe('clearSearchTagInput()', () => {
      it('should clear input field', () => {
        searchField.setValue('Daimler');

        component.clearSearchTagInput();
        expect(searchField.value).toEqual('');
      });

      it('should clear selected search filters', () => {
        component.selectedSearchFilters = [
          searchFilterTagLegalNameDaimler,
          searchFilterFlagRegisteredOffice
        ];

        component.clearSearchTagInput();
        expect(component.selectedSearchFilters).toEqual([]);
      });

      it('should clear filter options', fakeAsync(() => {
        searchServiceSpy.searchTagNamesFilter.complete();
        searchServiceSpy.searchFlagNamesFilter.complete();

        searchField.setValue('Auto');
        tick(300);

        component.clearSearchTagInput();
        fixture.detectChanges();
        expect(component.filterOptions).toEqual([]);

        discardPeriodicTasks();
      }));

      it('should set current page to 0', () => {
        component.currentPage = 42;

        component.clearSearchTagInput();
        expect(component.currentPage).toEqual(0);
      });
    });

    describe('resetSearchInput()', () => {
      it('should clear search field', () => {
        searchField.setValue('Daimler');

        component.resetSearchInput();
        expect(appStateServiceSpy.save).toHaveBeenCalledWith('searchValue', '');
        expect(searchField.value).toEqual('');
      });

      it('should clear search filter', () => {
        component.selectedSearchFilters = [new SearchFilter(FilterType.TAG, '', 'Daimler')];

        component.resetSearchInput();
        expect(appStateServiceSpy.save).toHaveBeenCalledWith('selectedSearchFilters', []);
        expect(component.selectedSearchFilters).toEqual([]);
      });
    });

    describe('set default search filtering from user settings()', () => {
      beforeEach(() => {
        userSettingsSpy.get.nextWith({
          defaultCountry: 'GB',
          searchOutletByDefaultCountry: false,
          searchOutletByActiveOutlet: false
        });

        userServiceSpy.getDefaultCountryId.nextWith('DE');
        masterCountryServiceSpy.getAll.nextWith([
          {
            id: 'DE',
            name: 'Germany',
            languages: []
          },
          {
            id: 'GB',
            name: 'United Kingdom',
            languages: []
          }
        ]);
      });

      it('should call api to get default country data for filtering when firstLoad', () => {
        appStateServiceSpy.get.mockReturnValue('firstLoad');

        component.ngOnInit();

        expect(masterCountryServiceSpy.getAll).toHaveBeenCalledTimes(1);
        expect(userServiceSpy.getDefaultCountryId).toHaveBeenCalledTimes(1);
      });

      it('should not call api to get default country data for filtering when not firstLoad', () => {
        appStateServiceSpy.get.mockReturnValue('secondLoad');

        component.ngOnInit();

        expect(masterCountryServiceSpy.getAll).toHaveBeenCalledTimes(0);
        expect(userServiceSpy.getDefaultCountryId).toHaveBeenCalledTimes(0);
      });

      it('should not set country filter if searchOutletByDefaultCountry is false', () => {
        appStateServiceSpy.get.mockReturnValueOnce('firstLoad').mockReturnValueOnce('');

        component.ngOnInit();
        expect(
          component.selectedSearchFilters.filter(
            filter => filter.type === FilterType.TAG && filter.name === 'countryName'
          ).length
        ).toBe(0);
      });

      it('should use countryId from user settings if user settings country is not null and searchOutletByDefaultCountry is true', () => {
        userSettingsSpy.get.nextWith({
          defaultCountry: 'GB',
          searchOutletByDefaultCountry: true,
          searchOutletByActiveOutlet: false
        });
        appStateServiceSpy.get.mockReturnValueOnce('firstLoad').mockReturnValueOnce('');

        component.ngOnInit();
        expect(
          component.selectedSearchFilters.filter(
            filter =>
              filter.type === FilterType.TAG &&
              filter.name === 'countryName' &&
              filter.value === 'United Kingdom'
          ).length
        ).toEqual(1);
      });

      it('should use countryId from user if user settings country is null and searchOutletByDefaultCountry is true', () => {
        userSettingsSpy.get.nextWith({
          defaultCountry: null,
          searchOutletByDefaultCountry: true,
          searchOutletByActiveOutlet: false
        });
        appStateServiceSpy.get.mockReturnValueOnce('firstLoad').mockReturnValueOnce('');

        component.ngOnInit();
        expect(
          component.selectedSearchFilters.filter(
            filter =>
              filter.type === FilterType.TAG &&
              filter.name === 'countryName' &&
              filter.value === 'Germany'
          ).length
        ).toEqual(1);
      });

      it('should not set outlet active filter if searchOutletByActiveOutlet is false', () => {
        appStateServiceSpy.get.mockReturnValueOnce('firstLoad').mockReturnValueOnce('');

        component.ngOnInit();
        expect(
          component.selectedSearchFilters.filter(
            filter => filter.type === FilterType.FLAG && filter.name === 'active'
          ).length
        ).toEqual(0);
      });
    });
  });
});
