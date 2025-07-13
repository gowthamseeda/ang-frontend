import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { MasterCountryGroup } from '../../services/master-country-group/master-country-group.model';
import { MasterCountryGroupService } from '../../services/master-country-group/master-country-group.service';

@Component({
  selector: 'gp-country-group-tile',
  templateUrl: './country-group-tile.component.html',
  styleUrls: ['./country-group-tile.component.scss']
})
export class CountryGroupTileComponent implements OnInit {
  countryGroups: MasterCountryGroup[];
  searchText: string;

  constructor(
    private masterCountryGroupService: MasterCountryGroupService,
    private sortingService: SortingService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initServices();
  }

  searchCountryGroupName(searchText: string): void {
    this.searchText = searchText;
  }

  deleteCountryGroup(serviceId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '650px',
      data: {
        title: 'DELETE_ENTRY',
        content: 'DELETE_ENTRY_QUESTION',
        confirmButton: 'YES'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.masterCountryGroupService.delete(serviceId).subscribe(
          () => {
            this.snackBarService.showInfo('DELETE_COUNTRY_GROUP_SUCCESS');
            this.initServices();
          },
          error => {
            this.snackBarService.showError(error);
          }
        );
      }
    });
  }

  private initServices(): void {
    this.masterCountryGroupService
      .getAll()
      .pipe(map(countryGroups => countryGroups.sort(this.sortingService.sortByName)))
      .subscribe(countryGroups => {
        this.countryGroups = countryGroups;
      });
  }
}
