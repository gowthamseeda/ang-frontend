import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { BehaviorSubject, combineLatest, forkJoin, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';

import { UserService } from '../../iam/user/user.service';
import { MasterCountryService } from '../../master/country/master-country/master-country.service';
import { MatomoEventTracker, SearchProperties } from '../../shared/matomo/event-tracker.model';
import { AppStateService } from '../../shared/services/state/app-state-service';
import { UserSettingsService } from '../../user-settings/user-settings/services/user-settings.service';
import { FilterOption, TypedFilterOption } from '../models/filter-option.model';
import { FilterType } from '../models/filter-type.model';
import { SearchFilter, SearchFilterTag } from '../models/search-filter.model';
import { SearchItem } from '../models/search-item.model';
import { SearchResultMessage } from '../search-result/search-result.component';
import { SearchItemResponse, SearchService } from '../search.service';
import { OutletResult } from '../shared/outlet-result/outlet-result.model';
import { SearchFilterChipListComponent } from '../shared/search-filter-chip-list/search-filter-chip-list.component';

import { SearchFieldSettings } from './searchfield-settings.model';

export class SearchTriggeredEvent {
  constructor(public source: SearchFieldComponent, public searchFilters: SearchFilter[]) {}
}

const PAGE_SIZE = 50;

@Component({
  selector: 'gp-searchfield',
  templateUrl: './searchfield.component.html',
  styleUrls: ['./searchfield.component.scss']
})
export class SearchFieldComponent implements OnInit, OnDestroy {
  @Input()
  predefinedSearchFilters: SearchFilter[];
  @Input()
  searchResultMessage: SearchResultMessage;
  @Input()
  placeHolderText: string;
  @Input()
  settings: SearchFieldSettings;
  @Input()
  excludedSearchItems: string[] = [];
  @Output()
  searchTriggered = new EventEmitter<SearchTriggeredEvent>();
  @Output()
  searchItemRetrieved = new EventEmitter<SearchItem<OutletResult>>();
  @Output()
  searchItemsRetrieved = new EventEmitter<SearchItem<OutletResult>[]>();
  @Output()
  searchResultsQueried = new EventEmitter();
  @Output()
  searchResultsReseted = new EventEmitter();
  @ViewChild('searchTagInput', { read: MatInput })
  searchTagInput: MatInput;
  @ViewChild(SearchFilterChipListComponent, { read: SearchFilterChipListComponent, static: true })
  searchFilterChipList: SearchFilterChipListComponent;

  searchForm: UntypedFormGroup;
  selectedSearchFilters: SearchFilter[] = [];
  sortedTopMatches: string[] = [];
  filterOptions: TypedFilterOption[];
  searchItems: BehaviorSubject<SearchItem<OutletResult>[]> = new BehaviorSubject<
    SearchItem<OutletResult>[]
  >([]);
  topMatchesListActive = false;
  keyupArrowdownEvent: KeyboardEvent;
  total: number;
  searchBusinessSitesError: Error | null;
  searchTopMatchesSubscription: Subscription;
  searchFilterOptionsSubscription: Subscription;
  searchBusinessSitesSubscription: Subscription;
  tagValue = '';
  currentPage: number;
  userRoles: string[];
  hideResults = false;
  checkedSearchItems: SearchItem<OutletResult>[] = [];

  private unsubscribe = new Subject<void>();

  constructor(
    private fb: UntypedFormBuilder,
    private searchService: SearchService,
    private appStateService: AppStateService,
    private matomoEventTracker: MatomoEventTracker,
    private userService: UserService,
    private userSettingsService: UserSettingsService,
    private changeDetector: ChangeDetectorRef,
    private masterCountryService: MasterCountryService
  ) {}

  get showSearchResults(): boolean {
    if (!this.searchTagInput) {
      return false;
    }

    return (
      (this.selectedSearchFilters.length > 0 ||
        this.sanitizeInput(this.searchTagInput.value).length >= 3) &&
      (!this.searchBusinessSitesInProgress || this.isLazyLoading())
    );
  }

  get searchInProgress(): boolean {
    return (
      (this.searchTopMatchesSubscription && !this.searchTopMatchesSubscription.closed) ||
      this.searchBusinessSitesInProgress ||
      (this.searchFilterOptionsSubscription && !this.searchFilterOptionsSubscription.closed)
    );
  }

  get searchBusinessSitesInProgress(): boolean {
    return this.searchBusinessSitesSubscription && !this.searchBusinessSitesSubscription.closed;
  }

  ngOnInit(): void {
    this.restoreSearch();

    this.searchForm = this.fb.group({ searchField: [this.tagValue] });
    this.searchForm.controls.searchField.valueChanges
      .pipe(
        takeUntil(this.unsubscribe),
        tap((tagValue: string) => {
          if (this.sanitizeInput(tagValue).length < 3) {
            this.checkedSearchItems = [];
            this.searchResultsReseted.emit();
            this.hideResults = true;
          } else {
            this.hideResults = false;
          }
        }),
        debounceTime(300),
        distinctUntilChanged(),
        filter((tagValue: string) => {
          const sanitizedTagValue = this.sanitizeInput(tagValue);

          this.tagValue = sanitizedTagValue;
          return (
            sanitizedTagValue.length >= 3 ||
            (this.selectedSearchFilters.length > 0 && sanitizedTagValue.length === 0)
          );
        })
      )
      .subscribe(() => this.search(true));

    this.userService
      .getRoles()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((roles: string[]) => (this.userRoles = roles));

    this.applyDefaultSearchFromUserSettings();
  }

  ngOnDestroy(): void {
    this.clearSearchTagInput();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onTopMatchesItemSelect(value: string): void {
    const topMatchItemTag = new SearchFilterTag(value).matchExact(true);

    this.applySearchFilter(topMatchItemTag);
  }

  onFilterSelect(filterOption: TypedFilterOption): void {
    switch (filterOption.type) {
      case FilterType.TAG:
        this.applySearchFilter(
          new SearchFilter(filterOption.type, filterOption.value, this.searchTagInput.value)
        );
        break;
      case FilterType.FLAG:
        this.applySearchFilter(new SearchFilter(filterOption.type, filterOption.value));
    }
  }

  search(saveSearch = false, focusInput = false): void {
    if (this.selectedSearchFilters.length === 0 && !this.tagValue) {
      this.resetSearchResult();
    } else {
      this.resetPage();
      this.checkedSearchItems = [];
      this.searchResultsQueried.emit();
      this.searchTopMatches(this.tagValue);
      this.searchBusinessSites(this.tagValue, this.currentPage, PAGE_SIZE);
      this.searchFilterOptions(this.tagValue);
    }

    if (saveSearch) {
      this.saveSearch();
    }
    if (focusInput) {
      this.searchTagInput.focus();
    }
  }

  toggleTopMatchesList(isActive: boolean, event?: FocusEvent): void {
    if (!event || event.target === null) {
      this.topMatchesListActive = isActive;
      if (isActive) {
        this.hideResults = false;
      }
    }
  }

  onKeyupArrowdown(event: KeyboardEvent): void {
    this.keyupArrowdownEvent = event;
  }

  onSearchItemClick(searchItems: SearchItem<OutletResult>[] | SearchItem<OutletResult>): void {
    this.hideResults = this.settings.searchResultItemClickAction === 'singleselect';

    if (Array.isArray(searchItems)) {
      this.checkedSearchItems = searchItems;
      this.searchItemsRetrieved.emit(searchItems);
    } else {
      this.searchItemRetrieved.emit(searchItems);
    }
  }

  fetchSearchItems(): void {
    if (this.searchItems.getValue().length >= this.total) {
      return;
    }

    this.currentPage += 1;
    this.searchBusinessSites(this.tagValue, this.currentPage, PAGE_SIZE);
  }

  onScrolledToEnd(event: any): void {
    if (event.target?.scrollTop > 0) {
      this.fetchSearchItems();
    }
  }

  clearSearchTagInput(): void {
    this.searchForm.controls.searchField.setValue('');
    this.selectedSearchFilters = [];
    this.filterOptions = [];
    this.checkedSearchItems = [];
    this.resetPage();
  }

  resetSearchInput(): void {
    this.clearSearchTagInput();
    const keyPrefix = this.getKeyPrefixByContext();
    this.appStateService.save(keyPrefix + 'searchValue', '');
    this.appStateService.save(keyPrefix + 'selectedSearchFilters', []);
    this.applyDefaultSearchFromUserSettings();
  }

  private sanitizeInput(input: string): string {
    return input.trim();
  }

  private isLazyLoading(): boolean {
    return this.currentPage > 0;
  }

  private applySearchFilter(searchFilter: SearchFilter): void {
    this.selectedSearchFilters.push(searchFilter);
    if (searchFilter.type === FilterType.FLAG) {
      this.searchTopMatches(this.searchTagInput.value);
      this.searchFilterOptions(this.searchTagInput.value);
      this.searchBusinessSites(this.tagValue);
    } else if (searchFilter.type === FilterType.TAG) {
      this.searchForm.controls.searchField.setValue('');
      this.toggleTopMatchesList(false);
    }
    this.searchTagInput.focus();
    this.saveSearch();
  }

  private resetPage(): void {
    this.currentPage = 0;
  }

  private searchTopMatches(tagValue: string): void {
    if (this.searchTopMatchesSubscription) {
      this.searchTopMatchesSubscription.unsubscribe();
    }

    this.toggleTopMatchesList(true);
    this.sortedTopMatches = [];

    const searchFilters = this.buildSearchFilters();

    this.searchTopMatchesSubscription = this.searchService
      .searchTopMatches(searchFilters, tagValue)
      .subscribe(topMatches => {
        this.sortedTopMatches = FilterOption.sortByMatchCountDesc(topMatches)
          .filter(item => item.value.toLowerCase() !== tagValue.toLowerCase())
          .map(item => item.value)
          .slice(0, 3);
      });
  }

  private searchBusinessSites(tagValue?: string, page?: number, pageSize?: number): void {
    if (this.searchBusinessSitesSubscription) {
      this.searchBusinessSitesSubscription.unsubscribe();
    }

    if (page === undefined || page === 0) {
      this.resetBusinessSitesResult();
    }

    const searchFilters = this.buildSearchFilters();
    if (tagValue) {
      searchFilters.push(new SearchFilterTag(tagValue));
    }

    this.searchBusinessSitesSubscription = this.searchService
      .search(
        searchFilters,
        page !== undefined ? page : 0,
        pageSize !== undefined ? pageSize : PAGE_SIZE
      )
      .pipe(
        map((response: SearchItemResponse) => {
          const searchItems = response.searchItems.filter(
            searchItem => !this.excludedSearchItems.includes(searchItem.id)
          );
          this.total =
            (this.total ? this.total : response.total) -
            response.searchItems.filter(item => this.excludedSearchItems.includes(item.id)).length;
          this.trackSearchRequest();
          return searchItems;
        })
      )
      .subscribe(
        searchItems => {
          if (page !== undefined && page > 0) {
            this.searchItems.next(this.searchItems.getValue().concat(searchItems));
            // Manual change detection is necessary because of an issue in perfect-scrollbar:
            // https://github.com/zefoy/ngx-perfect-scrollbar/issues/208
            this.changeDetector.detectChanges();
          } else {
            this.searchItems.next(searchItems);
          }
        },
        error => (this.searchBusinessSitesError = error)
      );
  }

  private searchFilterOptions(tagValue: string): void {
    if (this.searchFilterOptionsSubscription) {
      this.searchFilterOptionsSubscription.unsubscribe();
    }

    this.filterOptions = [];

    const searchFilters = this.buildSearchFilters();

    if (tagValue) {
      forkJoin([
        this.searchService.searchTagNamesFilter(searchFilters, tagValue),
        this.searchService.searchFlagNamesFilter(searchFilters, tagValue)
      ])
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(filterOptionsList => {
          const combined = filterOptionsList[0].concat(filterOptionsList[1]);
          this.filterOptions = FilterOption.sortByMatchCountDesc(combined);
        });
    } else {
      this.searchService
        .searchFlagNamesFilter(searchFilters)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(flagFilterOption => {
          this.filterOptions = flagFilterOption;
        });
    }
  }

  private trackSearchRequest(): void {
    if (this.tagValue === '' && this.selectedSearchFilters.length === 0) {
      return;
    }

    let searchValue = '';
    this.selectedSearchFilters.forEach((searchFilter, idx) => {
      searchValue += '(';
      searchValue += searchFilter.name !== undefined ? searchFilter.name : '';
      searchValue +=
        searchFilter.value !== undefined &&
        searchFilter.name !== undefined &&
        searchFilter.type === FilterType.TAG
          ? ':'
          : '';
      searchValue +=
        searchFilter.value !== undefined && searchFilter.type === FilterType.TAG
          ? searchFilter.value
          : '';
      searchValue += ')';

      if (idx < this.selectedSearchFilters.length - 1) {
        searchValue += ' ';
      }
    });
    searchValue += (this.tagValue !== '' && searchValue !== '' ? ' ' : '') + this.tagValue;

    if (searchValue) {
      const roles = this.userRoles !== undefined ? ' [' + this.userRoles.join(',') + ']' : '';

      this.matomoEventTracker.trackSiteSearch(
        new SearchProperties(searchValue + roles, 'Main Search', this.total)
      );
    }
  }

  private saveSearch(): void {
    if (!this.settings.saveSearchQuery) {
      return;
    }

    const keyPrefix = this.getKeyPrefixByContext();
    this.appStateService.save(keyPrefix + 'selectedSearchFilters', this.selectedSearchFilters);
    this.appStateService.save(keyPrefix + 'searchValue', this.tagValue);
  }

  private restoreSearch(): void {
    if (!this.settings.saveSearchQuery) {
      return;
    }

    const keyPrefix = this.getKeyPrefixByContext();
    this.selectedSearchFilters = this.appStateService.get(keyPrefix + 'selectedSearchFilters', []);
    this.tagValue = this.appStateService.get(keyPrefix + 'searchValue', '');

    if (this.selectedSearchFilters.length > 0 || this.tagValue !== '') {
      this.search();
    }
  }

  private buildSearchFilters(): SearchFilter[] {
    const searchFilters: SearchFilter[] = [];
    Object.assign(searchFilters, this.selectedSearchFilters);
    searchFilters.push(...this.predefinedSearchFilters);

    return searchFilters;
  }

  private resetSearchResult(): void {
    this.sortedTopMatches = [];
    this.filterOptions = [];
    this.resetBusinessSitesResult();
  }

  private resetBusinessSitesResult(): void {
    this.searchItems.next([]);
    this.total = 0;
    this.searchBusinessSitesError = null;
  }

  private getKeyPrefixByContext(): string {
    let keyPrefix = '';
    if (this.settings.contextId) {
      keyPrefix = this.settings.contextId.concat(':');
    }

    return keyPrefix;
  }

  private getDefaultCountry(
    userSettingsDefaultCountryId: string | null | undefined,
    userDefaultCountryId: string | null | undefined
  ): string | null | undefined {
    return userSettingsDefaultCountryId ? userSettingsDefaultCountryId : userDefaultCountryId;
  }

  private applyDefaultSearchFromUserSettings(): void {
    const isFirstLoad = this.appStateService.get('status', 'firstLoad') === 'firstLoad';
    if (isFirstLoad) {
      combineLatest([
        this.userSettingsService.get(),
        this.masterCountryService.getAll(),
        this.userService.getDefaultCountryId()
      ])
        .pipe(
          filter(observables => observables[1].length > 0),
          takeUntil(this.unsubscribe)
        )
        .subscribe(([userSettings, masterCountries, userDefaultCountryId]) => {
          let searchFilters: SearchFilter[] = [];

          if (userSettings.searchOutletByDefaultCountry) {
            const defaultCountryId = this.getDefaultCountry(
              userSettings.defaultCountry,
              userDefaultCountryId
            );
            const defaultCountry = masterCountries.find(
              country => country.id === defaultCountryId
            )?.name;

            if (defaultCountry) {
              searchFilters.push(new SearchFilter(FilterType.TAG, 'countryName', defaultCountry));
            }
          }

          if (userSettings.searchOutletByActiveOutlet) {
            searchFilters.push(new SearchFilter(FilterType.FLAG, 'active'));
          }

          const keyPrefix = this.getKeyPrefixByContext();
          const searchValue = this.appStateService.get(keyPrefix + 'searchValue', '');
          if (searchValue === '') {
            this.clearSearchTagInput();
            searchFilters.forEach((searchFilter, idx) => {
              this.applySearchFilter(searchFilter);
            });

            this.appStateService.save('status', 'secondLoad');
          }
        });
    }
  }
}
