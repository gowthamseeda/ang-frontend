import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { isMoment } from 'moment';
import { Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map, takeUntil } from 'rxjs/operators';

import { UserService } from '../../../iam/user/user.service';
import {
  SearchFilter,
  SearchFilterFlag,
  SearchFilterTag
} from '../../../search/models/search-filter.model';
import { SearchItem } from '../../../search/models/search-item.model';
import { SearchFieldSettings } from '../../../search/searchfield/searchfield-settings.model';
import { CanDeactivateComponent } from '../../../shared/guards/can-deactivate-guard.model';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { GpsValidators } from '../../../shared/validators/gps-validators';
import { AddressType } from '../../shared/models/address.model';
import { Outlet } from '../../shared/models/outlet.model';
import { OutletService } from '../../shared/services/outlet.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { BaseData4rService } from '../base-data-4r.service';

const defaultSearchFilters: SearchFilter[] = [
  new SearchFilterFlag('registeredOffice'),
  new SearchFilterFlag('activeOrInPlanning'),
  new SearchFilterTag('type=BusinessSite')
];

@Component({
  selector: 'gp-create-outlet',
  templateUrl: './create-outlet.component.html',
  styleUrls: ['./create-outlet.component.scss']
})
export class CreateOutletComponent implements OnInit, OnDestroy, AfterViewChecked, CanDeactivateComponent {
  searchFilters: Observable<SearchFilter[]>;
  outletForm: UntypedFormGroup;
  outlet: any;
  showForm = false;
  searchInProgress = false;
  searchFieldSettings: SearchFieldSettings;
  unsubscribe = new Subject<void>();
  isLoading = false;

  testOutlet: Boolean = false;
  productResponsible: Boolean = false;

  addressType: typeof AddressType = AddressType;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private outletService: OutletService,
    private changeDetectorRef: ChangeDetectorRef,
    private snackBarService: SnackBarService,
    private userService: UserService,
    public dialog: MatDialog,
    private baseData4rService: BaseData4rService
  ) { }

  ngOnInit(): void {
    this.initSearchFieldSettings();
    this.initOutletForm();
    this.initSearchFilter();

    this.baseData4rService.setEditPage(false);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.outletForm.pristine;
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  submitOutlet(): void {
    this.formatDate('startOperationDate');
    this.formatDate('closeDownDate');
    this.createOutlet();
  }

  reset(): void {
    this.outletForm.reset();
    this.outletForm.patchValue(this.outlet);
  }

  applyCompanyValues(searchItem: SearchItem<any>): void {
    this.searchInProgress = false;

    if (!searchItem.id) {
      return;
    }

    this.outletService
      .getOrLoadBusinessSite(searchItem.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(outlet => {
        this.showForm = true;
        if (!outlet.id || !outlet.countryId || !outlet.legalName) {
          return;
        }
        const { companyId, startOperationDate, closeDownDate, legalName, countryId } = outlet;

        this.outlet = {
          companyId,
          legalName,
          startOperationDate,
          closeDownDate,
          countryId
        };

        this.outletForm.patchValue(this.outlet);
      });
  }

  scrollToFragment(fragment: string): void {
    const element = document.getElementById(fragment);
    if (fragment && element) {
      element.scrollIntoView();
    }
  }

  addressStreetDataRequired(): boolean {
    const gpsGroup = this.outletForm.get('gps');
    if (!gpsGroup) {
      return true;
    }
    return (
      GpsValidators.longitudeEmpty(gpsGroup.value) && GpsValidators.latitudeEmpty(gpsGroup.value)
    );
  }

  private createOutlet(): void {
    this.isLoading = true;
    this.outletForm.markAsPristine();

    const outlet: Outlet = this.outletForm.value;
    const distributionLevels = this.outletForm.value.distributionLevels;

    this.outletService
      .createWithDistributionLevels(this.outlet.companyId, outlet, distributionLevels)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        (id: string) => {
          this.router.navigateByUrl('/outlet/' + id);
          this.snackBarService.showInfo('CREATE_OUTLET_SUCCESS');
        },
        error => {
          const createdOutletId = error.createdOutletId;
          if (createdOutletId) {
            this.router.navigateByUrl('/outlet/' + createdOutletId);
          }
          this.snackBarService.showError(error);
        }
      );
  }

  private initSearchFilter(): void {
    this.searchFilters = this.userService.getCountryRestrictions().pipe(
      map(countryRestrictions => {
        if (countryRestrictions.length === 0) {
          return defaultSearchFilters;
        }
        return [
          ...defaultSearchFilters,
          ...[new SearchFilterTag('countryId=' + countryRestrictions.join(' '))]
        ];
      }),
      catchError(() => of(defaultSearchFilters))
    );
  }

  private formatDate(dateKey: string): void {
    if (
      this.outletForm.value &&
      this.outletForm.value[dateKey] &&
      isMoment(this.outletForm.value[dateKey])
    ) {
      this.outletForm.value[dateKey] = this.outletForm.value[dateKey].format('YYYY-MM-DD');
    }
  }

  private initOutletForm(): void {
    this.outletForm = this.formBuilder.group({});
    this.checkTestOutletUser();
  }

  checkTestOutletUser(): void {
    this.userService.getRoles().subscribe(Roles => {
      if (Roles.includes('GSSNPLUS.TestOutletUser')) {
        this.testOutlet = true;
      } else if (Roles.includes('GSSNPLUS.ProductResponsible')) {
        this.productResponsible = true;
      }
    });
  }

  private initSearchFieldSettings(): void {
    this.searchFieldSettings = new SearchFieldSettings({
      contextId: 'CreateOutlet'
    });
  }

  compareByCountryId(countryId: string): void {
    if (this.outlet.countryId !== countryId) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'COUNTRY_SELECTED_NOT_MATCH_RO_COUNTRY',
          confirmButton: 'OK',
          hideCancelButton: true
        }
      });
    }
  }
}
