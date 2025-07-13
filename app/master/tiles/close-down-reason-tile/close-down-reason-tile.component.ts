import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { MasterCloseDownReason } from '../../services/master-close-down-reasons/master-close-down-reason.model';
import { MasterCloseDownReasonsService } from '../../services/master-close-down-reasons/master-close-down-reasons.service';

@Component({
  selector: 'gp-close-down-reason-tile',
  templateUrl: './close-down-reason-tile.component.html',
  styleUrls: ['./close-down-reason-tile.component.scss']
})
export class CloseDownReasonTileComponent implements OnInit {
  closeDownReasons: MasterCloseDownReason[];
  searchText: string;

  constructor(
    private closeDownReasonsService: MasterCloseDownReasonsService,
    private sortingService: SortingService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initCloseDownReason();
  }

  deleteCloseDownReason(closeDownReasonId: string): void {
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
        this.closeDownReasonsService.delete(closeDownReasonId).subscribe(
          () => {
            this.snackBarService.showInfo('DELETE_CLOSE_DOWN_REASON_SUCCESS');
            this.initCloseDownReason();
          },
          error => {
            this.snackBarService.showError(error);
          }
        );
      }
    });
  }

  searchCloseDownReasonName(searchText: string): void {
    this.searchText = searchText;
  }

  private initCloseDownReason(): void {
    this.closeDownReasonsService
      .getAll()
      .pipe(map(closeDownReasons => closeDownReasons.sort(this.sortingService.sortByName)))
      .subscribe(closeDownReasons => {
        this.closeDownReasons = closeDownReasons;
      });
  }
}
