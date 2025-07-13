import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ServiceFilterCriteria } from '../../models/service-table-row.model';
import { ServiceTableFilterService } from '../../services/service-table-filter.service';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';

@Component({
  selector: 'gp-service-filter-dialog',
  templateUrl: './service-filter-dialog.component.html',
  styleUrls: ['./service-filter-dialog.component.scss']
})
export class ServiceFilterDialogComponent implements OnInit, OnDestroy {
  serviceFilterFormGroup: UntypedFormGroup;
  copyOfferedServiceToggle = false;

  private filterCriteria: ServiceFilterCriteria;
  private pristineFilterCriteria: ServiceFilterCriteria;
  private unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<ServiceFilterDialogComponent>,
    private serviceTableFilterService: ServiceTableFilterService,
    private offeredServiceService: OfferedServiceService
  ) {
    this.serviceTableFilterService.filterCriteria
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(filterCriteria => {
        this.filterCriteria = filterCriteria;
      });
  }

  ngOnInit(): void {
    this.initFormGroup(this.filterCriteria);

    this.serviceTableFilterService.pristineFilterCriteria.pipe(take(1)).subscribe(pristine => {
      this.pristineFilterCriteria = pristine;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  search(): void {
    const serviceFilter = this.serviceFilterFormGroup.getRawValue();
    const filterCriteria: ServiceFilterCriteria = {
      isOfferedService: {
        value: serviceFilter.isOfferedService,
        isEnabled: this.filterCriteria.isOfferedService.isEnabled
      }
    };

    this.serviceTableFilterService.changeFilterCriteriaTo(filterCriteria);
    this.dialogRef.close(filterCriteria);
  }

  reset(): void {
    this.filterCriteria = this.pristineFilterCriteria;
    this.initFormGroup(this.pristineFilterCriteria);
    this.search();
  }

  private initFormGroup(serviceFilterCriteria: ServiceFilterCriteria): void {
    this.serviceFilterFormGroup = this.formBuilder.group(serviceFilterCriteria);
    this.serviceFilterFormGroup.disable();

    this.patchUpdateFormGroup();
  }

  private patchUpdateFormGroup(): void {
    this.offeredServiceService.isEmpty().subscribe(isEmpty => {
      if (isEmpty) {
        this.serviceFilterFormGroup.controls['isOfferedService'].setValue(false);
      } else {
        this.serviceFilterFormGroup.controls['isOfferedService'].setValue(
          this.filterCriteria.isOfferedService.value
        );
        if (this.filterCriteria.isOfferedService.isEnabled) {
          this.serviceFilterFormGroup.controls['isOfferedService'].enable();
        }
      }
    });
  }
}
