import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { MasterLabel } from '../../services/master-label/master-label.model';
import { MasterLabelService } from '../../services/master-label/master-label.service';

@Component({
  selector: 'gp-label-tile',
  templateUrl: './label-tile.component.html',
  styleUrls: ['./label-tile.component.scss']
})
export class LabelTileComponent implements OnInit {
  labels: MasterLabel[];
  searchText: string;

  constructor(
    private labelService: MasterLabelService,
    private sortingService: SortingService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initLabels();
  }

  searchLabelName(searchText: string): void {
    this.searchText = searchText;
  }

  deleteLabel(labelId: number): void {
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
        this.labelService.delete(labelId).subscribe(
          () => {
            this.snackBarService.showInfo('DELETE_LABEL_SUCCESS');
            this.initLabels();
          },
          error => {
            this.snackBarService.showError(error);
          }
        );
      }
    });
  }

  private initLabels(): void {
    this.labelService
      .getAll()
      .pipe(map((labels: MasterLabel[]) => labels.sort(this.sortingService.sortByName)))
      .subscribe((labels: MasterLabel[]) => {
        this.labels = labels;
      });
  }
}
