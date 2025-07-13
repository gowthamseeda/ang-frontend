import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterOutletRelationship } from '../../services/master-outlet-relationship/master-outlet-relationship.model';
import {
  MasterOutletRelationshipService
} from '../../services/master-outlet-relationship/master-outlet-relationship.service';

@Component({
  selector: 'gp-outlet-relationship-tile',
  templateUrl: './outlet-relationship-tile.component.html',
  styleUrls: ['./outlet-relationship-tile.component.scss']
})
export class OutletRelationshipTileComponent implements OnInit {
  outletRelationships: MasterOutletRelationship[];
  searchText: string;

  constructor(
    private outletRelationshipService: MasterOutletRelationshipService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService
  ) {
  }

  ngOnInit(): void {
    this.initOutletRelationship();
  }

  searchOutletRelationshipName(searchText: string): void {
    this.searchText = searchText;
  }

  private initOutletRelationship(): void {
    this.outletRelationshipService.getAll().subscribe(outletRelationships => {
      this.outletRelationships = outletRelationships;
    });
  }

  deleteOutletRelationship(outletRelationshipId: string) {
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
        this.outletRelationshipService.delete(outletRelationshipId).subscribe({
            next: () => {
              this.snackBarService.showInfo('DELETE_OUTLET_RELATIONSHIP_SUCCESS');
              this.initOutletRelationship();
            },
            error: (error) => {
              this.snackBarService.showError(error);
            }
          }
        );
      }
    });
  }
}
