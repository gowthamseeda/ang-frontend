import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { DealerGroupsService } from '../../../dealer-groups/dealer-groups.service';
import { GeneralGroupsService } from '../../../general-groups/general-groups.service';
import { GeneralGroups } from '../../../general-groups/model/general-groups.model';
import { DealerGroups } from '../../../models/dealer-group.model';

@Component({
  selector: 'gp-successor-selection',
  templateUrl: './successor-selection.component.html',
  styleUrls: ['./successor-selection.component.scss']
})
export class SuccessorSelectionComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    successorGroup: new UntypedFormControl('', Validators.required)
  });
  isLoading: boolean;

  constructor(
    private generalGroupsService: GeneralGroupsService,
    private dealerGroupsService: DealerGroupsService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<SuccessorSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.name.trim().toLowerCase().indexOf(filter) !== -1;
    };

    this.data.generalGroupId ? this.getGeneralGroups() : this.getDealerGroups();
  }

  filterTable(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private getGeneralGroups(): void {
    this.generalGroupsService
      .getAll()
      .pipe(
        catchError(error => {
          this.isLoading = false;
          this.snackBarService.showError(error);
          return of({} as GeneralGroups);
        })
      )
      .subscribe((generalGroups: GeneralGroups) => {
        this.dataSource.data = generalGroups.generalGroups.filter(
          generalGroup =>
            generalGroup.active && generalGroup.generalGroupId !== this.data.generalGroupId
        );
        this.isLoading = false;
      });
  }

  private getDealerGroups(): void {
    this.dealerGroupsService
      .getAll()
      .pipe(
        catchError(error => {
          this.isLoading = false;
          this.snackBarService.showError(error);
          return of({} as DealerGroups);
        })
      )
      .subscribe((dealerGroups: DealerGroups) => {
        this.dataSource.data = dealerGroups.dealerGroups.filter(
          dealerGroup => dealerGroup.active && dealerGroup.dealerGroupId !== this.data.dealerGroupId
        );
        this.isLoading = false;
      });
  }
}
