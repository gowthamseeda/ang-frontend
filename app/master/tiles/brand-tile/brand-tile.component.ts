import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MasterBrandService } from 'app/master/brand/master-brand/master-brand.service';

import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterBrand } from '../../brand/master-brand/master-brand.model';
import { DetailsLinks } from '../../shared/master-tile/master-tile.component';

@Component({
  selector: 'gp-brand-tile',
  templateUrl: './brand-tile.component.html',
  styleUrls: ['./brand-tile.component.scss']
})
export class BrandTileComponent implements OnInit {
  brands: MasterBrand[];
  searchText: string;
  menuItems: DetailsLinks[];

  constructor(
    private brandService: MasterBrandService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initMenuItems();
    this.initBrands();
  }

  deleteBrand(brandId: string): void {
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
        this.brandService.delete(brandId).subscribe(
          () => {
            this.snackBarService.showInfo('DELETE_BRAND_SUCCESS');
            this.initBrands();
          },
          error => {
            this.snackBarService.showError(error);
          }
        );
      }
    });
  }

  searchBrandName(searchText: string): void {
    this.searchText = searchText;
  }

  initMenuItems(): void {
    this.menuItems = [
      {
        link: '/master/brand/priority',
        text: 'EDIT_BRAND_PRIORITY'
      }
    ];
  }

  private initBrands(): void {
    this.brandService.getAll().subscribe(brands => {
      this.brands = brands;
    });
  }
}
