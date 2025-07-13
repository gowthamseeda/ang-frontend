import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterCountry } from '../../country/master-country/master-country.model';
import { MasterCountryService } from '../../country/master-country/master-country.service';

@Component({
  selector: 'gp-country-tile',
  templateUrl: './country-tile.component.html',
  styleUrls: ['./country-tile.component.scss']
})
export class CountryTileComponent implements OnInit {
  countries: MasterCountry[];
  searchText: string;

  constructor(
    private countryService: MasterCountryService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initCountries();
  }

  deleteCountry(countryId: string): void {
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
        this.countryService.delete(countryId).subscribe(
          () => {
            this.snackBarService.showInfo('DELETE_COUNTRY_SUCCESS');
            this.initCountries();
          },
          error => {
            this.snackBarService.showError(error);
          }
        );
      }
    });
  }

  searchCountryName(searchText: string): void {
    this.searchText = searchText;
  }

  private initCountries(): void {
    this.countryService.getAll().subscribe((countries: MasterCountry[]) => {
      this.countries = countries;
    });
  }
}
