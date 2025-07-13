import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { SearchFilterFlag, SearchFilterTag } from '../../../../search/models/search-filter.model';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { OutletDetailsDescription } from '../../../shared/presentational/outlet-details/outlet-details.component';
import { OutletInformationComponent } from '../../../shared/presentational/outlet-information/outlet-information.component';
import { OutletSearchSelectionComponent } from '../../../shared/presentational/outlet-search-selection/outlet-search-selection.component';
import { AdminType, OutletStatus } from '../../../shared/models/outlet.model';
import {
  GenericAdminOutletResponse,
  Precondition
} from '../../../shared/service/api/admin-response.model';
import { UpdateMoveOutlet } from '../../service/api/actions.model';

@Component({
  selector: 'gp-move-outlet',
  templateUrl: './move-outlet.component.html',
  styleUrls: ['./move-outlet.component.scss']
})
export class MoveOutletComponent implements OnInit, OnDestroy {
  adminType: AdminType = AdminType.moveOutlet;
  selectedOutlet: OutletStatus;
  outletDescription: OutletDetailsDescription;
  preconditions: Precondition[];
  uncheckedKeys: string[] = [];

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
      previousHeader: 'ADMIN_MOVE_OUTLET_PREVIOUS_OUTLET',
      previousAddIconTooltip: 'ADMIN_MOVE_OUTLET_ADD_PREVIOUS_OUTLET_TOOLTIP',
      previousRemoveIconTooltip: 'ADMIN_MOVE_OUTLET_REMOVE_PREVIOUS_OUTLET_TOOLTIP',
      currentHeader: 'ADMIN_MOVE_OUTLET_CURRENT_OUTLET',
      currentAddIconTooltip: 'ADMIN_MOVE_OUTLET_ADD_CURRENT_OUTLET_TOOLTIP',
      currentRemoveIconTooltip: 'ADMIN_MOVE_OUTLET_REMOVE_CURRENT_OUTLET_TOOLTIP'
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
          previousTitle: 'ADMIN_MOVE_OUTLET_SEARH_HEADER',
          currentTitle: 'ADMIN_SWITCH_RO_SEARH_HEADER',
          currentSearchFilter: currentSearchFilters,
          previousSearchFilter: previousSearchFilters
        }
      });
      dialog
        .afterClosed()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((outlets: OutletStatus | false) => {
          this.continueSearchOrDoNothing();
          this.verifyShowButtons();
        });
    }
  }

  filterCurrentSearch(outlet: OutletStatus): (SearchFilterTag | SearchFilterFlag)[] {
    const searchFilters = [
      new SearchFilterTag('type=BusinessSite'),
      new SearchFilterFlag('registeredOffice')
    ];

    return searchFilters;
  }

  filterPreviousSearch(outlet: OutletStatus): (SearchFilterTag | SearchFilterFlag)[] {
    const searchFilters = [new SearchFilterTag('type=BusinessSite')];

    return searchFilters;
  }

  verifyShowButtons(): void {
    this.isDisabledButton = !(
      this.selectedOutlet.previous !== null && this.selectedOutlet.current !== null
    );
  }

  continueSearchOrDoNothing(): void {
    if (
      (this.selectedOutlet.previous != null &&
        this.selectedOutlet.isAddPreviousSelected &&
        this.selectedOutlet.current == null) ||
      (this.selectedOutlet.current != null &&
        this.selectedOutlet.isAddCurrentSelected &&
        this.selectedOutlet.previous == null)
    ) {
      this.selectedOutlet.isAddCurrentSelected = !this.selectedOutlet.isAddCurrentSelected;
      this.selectedOutlet.isAddPreviousSelected = !this.selectedOutlet.isAddPreviousSelected;
      this.changeOutletDetails(this.selectedOutlet);
    }
  }

  openOutletInformationDialog(): void {
    const dialog = this.matDialog.open(OutletInformationComponent, {
      data: this.uncheckedKeys
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((keys: string[] | false) => {
        if (keys) {
          this.uncheckedKeys = keys;
        }
      });
  }

  cancel(): void {
    this.ngOnInit();
    this.preconditions = [];
    this.uncheckedKeys = [];
  }

  canDeactivate(): boolean {
    return this.isDisabledButton || this.isResponded;
  }

  save(): void {
    this.isLoading = true;
    this.isDisabledButton = true;
    const outletId = this.selectedOutlet.previous?.outletId ?? '';

    this.outletService
      .moveOutlet(outletId, this.mapToUpdateResource())
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        (response: GenericAdminOutletResponse) => {
          this.isResponded = true;
          this.preconditions = response.preconditions ?? [];

          if (response.status) {
            this.snackBarService.showInfo('ADMIN_MOVE_OUTLET_SUCCESS');
          } else {
            this.isDisabledButton = false;
            this.snackBarService.showInfo('ADMIN_MOVE_OUTLET_FAILED');
          }
        },
        error => {
          this.snackBarService.showError(error);
        }
      );
  }

  mapToUpdateResource(): UpdateMoveOutlet {
    return {
      companyId: this.selectedOutlet.current?.companyId ?? '',
      toBeRemovedOutletInformations: this.uncheckedKeys
    };
  }
}
