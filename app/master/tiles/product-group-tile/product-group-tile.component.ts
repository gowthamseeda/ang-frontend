import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MasterProductGroup } from 'app/master/product-group/master-product-group/master-product-group.model';

import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterProductGroupService } from '../../product-group/master-product-group/master-product-group.service';

const productProupIcons: string[] = ['pc', 'van', 'bus', 'truck', 'unimog'];

@Component({
  selector: 'gp-product-group-tile',
  templateUrl: './product-group-tile.component.html',
  styleUrls: ['./product-group-tile.component.scss']
})
export class ProductGroupTileComponent implements OnInit {
  productGroups: MasterProductGroup[];
  searchText: string;

  constructor(
    private productGroupService: MasterProductGroupService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initProductGroups();
  }

  deleteProductGroup(productGroupId: string): void {
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
        this.productGroupService.delete(productGroupId).subscribe(
          () => {
            this.snackBarService.showInfo('DELETE_PRODUCT_GROUP_SUCCESS');
            this.initProductGroups();
          },
          error => {
            this.snackBarService.showError(error);
          }
        );
      }
    });
  }

  searchProductGroupName(searchText: string): void {
    this.searchText = searchText;
  }

  hasProductGroupIcon(productGroupId: string): boolean {
    return productProupIcons.includes(productGroupId.toLowerCase());
  }

  private initProductGroups(): void {
    this.productGroupService.getAll().subscribe(productGroups => {
      this.productGroups = productGroups;
    });
  }
}
