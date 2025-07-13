import { Component, OnInit } from '@angular/core';
import { MasterRetailCountryService } from '../../services/master-retail-country/master-retail-country.service';
import { MasterRetailCountry } from '../../services/master-retail-country/master-retail-country.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';

@Component({
  selector: 'gp-retail-country-tile',
  templateUrl: './retail-country-tile.component.html',
  styleUrls: ['./retail-country-tile.component.scss']
})
export class RetailCountryTileComponent implements OnInit {
  retailCountries: MasterRetailCountry[];
  searchText: string;

  constructor(
    private masterRetailCountryService: MasterRetailCountryService,
    private dialog: MatDialog,
    private snackBarService:SnackBarService
  ) {}

  ngOnInit(): void {
    this.initRetailCountries();
  }

  private initRetailCountries(): void {
    this.masterRetailCountryService.getAll().subscribe(retailCountries => {
      this.retailCountries = retailCountries;
    });
  }

  searchRetailCountryName(searchText: string): void {
    this.searchText = searchText;
  }

  deleteRetailCountry(retailCountryId: string): void {
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
        this.masterRetailCountryService.delete(retailCountryId).subscribe(
          () => {
            this.snackBarService.showInfo('DELETE_RETAIL_COUNTRY_SUCCESS');
            this.initRetailCountries();
          },
          error => {
            this.snackBarService.showError(error);
          }
        );
      }
    });
  }
}
