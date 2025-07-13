import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  BusinessSiteIds,
  BusinessSiteSelectValidator
} from '../../../../shared/validators/business-site-select-validator';
import { SubmitIndependentErrorStateMatcher } from '../../../../shared/validators/error-state-matchers/submit-independent-error-state-matcher';
import { DataRestrictionService } from '../../../data-restriction/data-restriction.service';

@Component({
  selector: 'gp-business-site-select-dialog',
  templateUrl: './business-site-select-dialog.component.html',
  styleUrls: ['./business-site-select-dialog.component.scss']
})
export class BusinessSiteSelectDialogComponent implements OnInit, OnDestroy {
  form: UntypedFormGroup;
  errorStateMatcher = new SubmitIndependentErrorStateMatcher();
  foundBusinessSiteIds: BusinessSiteIds = {
    ids: []
  };
  limit = 50;

  private unsubscribe = new Subject<void>();

  constructor(
    private dataRestrictionService: DataRestrictionService,
    public dialogRef: MatDialogRef<BusinessSiteSelectDialogComponent>,
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      businessSiteId: [
        '',
        BusinessSiteSelectValidator.validateBusinessSiteId(this.foundBusinessSiteIds)
      ]
    });

    this.form.controls['businessSiteId'].valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(value => {
        this.search(value);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private search(value: string): void {
    this.dataRestrictionService
      .getBusinessSiteIds(this.data.dataRestrictionId, value, this.limit)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        businesssiteRestrictions => {
          const businessSiteIds = businesssiteRestrictions
            .filter(currentValue => !this.data.assignedDataRestrictionValues.includes(currentValue))
            .sort();
          this.foundBusinessSiteIds.ids = businessSiteIds;
        },
        () => {
          this.foundBusinessSiteIds.ids = [];
        }
      );
  }
}
