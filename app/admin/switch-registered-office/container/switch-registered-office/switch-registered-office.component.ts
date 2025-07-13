import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { Outlet } from '../../../../legal-structure/shared/models/outlet.model';
import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { SearchFilterFlag, SearchFilterTag } from '../../../../search/models/search-filter.model';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { OutletDetailsDescription } from '../../../shared/presentational/outlet-details/outlet-details.component';
import { OutletSearchSelectionComponent } from '../../../shared/presentational/outlet-search-selection/outlet-search-selection.component';
import { AdminType, OutletDetails, OutletStatus } from '../../../shared/models/outlet.model';
import {
  GenericAdminOutletResponse,
  Precondition
} from '../../../shared/service/api/admin-response.model';

@Component({
  selector: 'gp-switch-registered-office',
  templateUrl: './switch-registered-office.component.html',
  styleUrls: ['./switch-registered-office.component.scss']
})
export class SwitchRegisteredOfficeComponent implements OnInit, OnDestroy {
  adminType: AdminType = AdminType.switchRegisteredOffice;
  outletDescription: OutletDetailsDescription;
  selectedOutlet: OutletStatus;
  preconditions: Precondition[];
  isLoading = false;
  isDisabledButton = true;
  isResponded = false;

  private unsubscribe = new Subject<void>();

  constructor(
    private matDialog: MatDialog,
    private outletService: OutletService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initOutlet();
  }

  ngOnDestroy(): void {
    this.preconditions = [];
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initOutlet(): void {
    this.outletDescription = {
      previousHeader: 'ADMIN_SWITCH_RO_PREVIOUS_OUTLET',
      previousAddIconTooltip: 'ADMIN_SWITCH_RO_ADD_PREVIOUS_OUTLET_TOOLTIP',
      previousRemoveIconTooltip: 'ADMIN_SWITCH_RO_REMOVE_PREVIOUS_OUTLET_TOOLTIP',
      currentHeader: 'ADMIN_SWITCH_RO_CURRENT_OUTLET',
      currentAddIconTooltip: 'ADMIN_SWITCH_RO_ADD_CURRENT_OUTLET_TOOLTIP',
      currentRemoveIconTooltip: 'ADMIN_SWITCH_RO_REMOVE_CURRENT_OUTLET_TOOLTIP'
    };

    this.selectedOutlet = {
      previous: null,
      current: null
    };
  }

  changeOutletDetails(outlet: OutletStatus): void {
    this.verifyShowButtons();

    if (outlet.isAddCurrentSelected || outlet.isAddPreviousSelected) {
      const currentSearchFilters = this.filterCurrentSearch(outlet);
      const previousSearchFilters = this.filterPreviousSearch(outlet);

      const dialog = this.matDialog.open(OutletSearchSelectionComponent, {
        width: '650px',
        height: '650px',
        data: {
          outlets: this.selectedOutlet,
          previousTitle: 'Search for registered office from company',
          currentTitle: 'Search for outlet to switch to',
          currentSearchFilter: currentSearchFilters,
          previousSearchFilter: previousSearchFilters
        }
      });
      dialog
        .afterClosed()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((outlets: OutletStatus | false) => {
          this.continueSearchOrDoNothing();
          this.displayRegisteredOffice();
          this.verifyShowButtons();
        });
    }
  }

  filterCurrentSearch(outlet: OutletStatus): (SearchFilterTag | SearchFilterFlag)[] {
    const searchFilters = [new SearchFilterTag('type=BusinessSite')];

    if (outlet.previous !== null && outlet.current === null) {
      searchFilters.push(new SearchFilterTag('companyId=' + outlet.previous?.companyId));
    }
    return searchFilters;
  }

  filterPreviousSearch(outlet: OutletStatus): (SearchFilterTag | SearchFilterFlag)[] {
    const searchFilters = [
      new SearchFilterTag('type=BusinessSite'),
      new SearchFilterFlag('registeredOffice')
    ];

    if (outlet.current !== null && outlet.previous === null) {
      searchFilters.push(new SearchFilterTag('companyId=' + outlet.current?.companyId));
    }
    return searchFilters;
  }

  continueSearchOrDoNothing(): void {
    if (
      this.selectedOutlet.previous != null &&
      this.selectedOutlet.isAddPreviousSelected &&
      this.selectedOutlet.current == null
    ) {
      this.selectedOutlet.isAddCurrentSelected = !this.selectedOutlet.isAddCurrentSelected;
      this.selectedOutlet.isAddPreviousSelected = !this.selectedOutlet.isAddPreviousSelected;
      this.changeOutletDetails(this.selectedOutlet);
    }
  }

  displayRegisteredOffice(): void {
    if (
      this.selectedOutlet.current != null &&
      this.selectedOutlet.isAddCurrentSelected &&
      this.selectedOutlet.previous == null
    ) {
      if (this.selectedOutlet.current.isRegisteredOffice) {
        this.selectedOutlet.previous = this.selectedOutlet.current;
        this.selectedOutlet.current = null;
        this.changeOutletDetails(this.selectedOutlet);
      } else {
        this.mapRegisteredOffice(this.selectedOutlet.current);
      }
    }
  }

  mapRegisteredOffice(currentOutlet: OutletDetails): void {
    this.outletService
      .getCompany(currentOutlet?.companyId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((outlet: Outlet) => {
        this.selectedOutlet.previous = {
          city: outlet.address.city,
          companyId: outlet.id,
          countryName: currentOutlet.countryName,
          isRegisteredOffice: outlet.registeredOffice ?? false,
          legalName: outlet.legalName,
          outletId: outlet.registeredOfficeId ?? '',
          state: outlet.state ?? '',
          streetNumber: outlet.address.streetNumber,
          street: outlet.address.street,
          zipCode: outlet.address.zipCode,
          isActive: outlet.active ?? false
        };

        this.verifyShowButtons();
      });
  }

  verifyShowButtons(): void {
    this.isDisabledButton = !(
      this.selectedOutlet.previous !== null && this.selectedOutlet.current !== null
    );
  }

  cancel(): void {
    this.ngOnInit();
    this.preconditions = [];
  }

  canDeactivate(): boolean {
    return this.isDisabledButton || this.isResponded;
  }

  save(): void {
    this.isLoading = true;
    this.isDisabledButton = true;
    const outletId = this.selectedOutlet.current?.outletId ?? '';
    const outletCompany = this.selectedOutlet.current?.companyId ?? '';

    this.outletService
      .switchRegisteredOffice(outletCompany, outletId)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        (response: GenericAdminOutletResponse) => {
          this.isResponded = true;
          this.preconditions = response.preconditions ?? [];

          if (response.status) {
            this.snackBarService.showInfo('ADMIN_SWITCH_RO_SUCCESS');
          } else {
            this.isDisabledButton = false;
            this.snackBarService.showInfo('ADMIN_SWITCH_RO_FAILED');
          }
        },
        error => {
          this.snackBarService.showError(error);
        }
      );
  }
}
