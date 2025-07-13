import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskFooterEvent } from 'app/tasks/task.model';
import { Subject } from 'rxjs';
import { Service } from './../../../services/service/models/service.model';
import { MultiSelectOfferedServiceIds } from '../../../services/service/models/multi-select.model';
import { UserSettingsService } from "../../../user-settings/user-settings/services/user-settings.service";
import {finalize} from "rxjs/operators";
import {SnackBarService} from "../../../shared/services/snack-bar/snack-bar.service";
interface ServiceWithBrands extends Service {
  brandIds: string[];
}

@Component({
  selector: 'gp-opening-hours-confirmation',
  templateUrl: './opening-hours-confirmation.component.html',
  styleUrls: ['./opening-hours-confirmation.component.scss']
})
export class OpeningHoursConfirmationComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['service', 'brands', 'productGroups'];
  dataSource: ServiceWithBrands[];
  blockedDataSource: ServiceWithBrands[];
  doNotShowAgainCheckBoxChecked: boolean = false;
  outletIds: string[] = [];

  private unsubscribe = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<OpeningHoursConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      firstDaySelected: boolean;
      secondDaySelected: boolean;
      selectedServices: MultiSelectOfferedServiceIds[];
      offeredServiceIds: string[];
      event: TaskFooterEvent;
      services: Service[];
      blockedServices: Service[];
      outletIds: string[];
    },
    private userSettingsService: UserSettingsService,
    private snackBarService: SnackBarService
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.outletIds =  this.data.outletIds;
    this.dataSource = this.data.services.map(service => {
      return {
        ...service,
        brandIds:
          this.distinctList(
            service.brandProductGroups?.map(brandProductGroup => brandProductGroup.brandId)
          ) ?? []
      };
    });
    this.blockedDataSource = this.data.blockedServices.map(blockedService => {
      return {
        ...blockedService,
        brandIds:
          this.distinctList(
            blockedService.brandProductGroups?.map(brandProductGroup => brandProductGroup.brandId)
          ) ?? []
      };
    });
  }

  save(): void {
    this.userSettingsService
      .updateUserDoNotShowMultiSelectConfirmationDialog(this.doNotShowAgainCheckBoxChecked)
      .pipe( finalize(() => {
        this.dialogRef.close(true);
      }))
      .subscribe({error: (err) => {
        this.snackBarService.showError(err)
      }});
  }

  distinctList(list: string[] | undefined) {
    return list ? [...new Set(list)] : list;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  getProductGroupIds(service: string, brandId: string): string[] {
    return (
      this.dataSource
        .find(data => data.name == service)
        ?.brandProductGroups?.filter(brandProductGroup => brandProductGroup.brandId == brandId)
        .map(brandProductGroup => brandProductGroup.productGroupId) || []
    );
  }

  getBlockedProductGroupIds(service: string, brandId: string): string[] {
    return (
      this.blockedDataSource
        .find(data => data.name == service)
        ?.brandProductGroups?.filter(brandProductGroup => brandProductGroup.brandId == brandId)
        .map(brandProductGroup => brandProductGroup.productGroupId) || []
    );
  }

  doNotShowAgainCheckBoxChange() : void {
    this.doNotShowAgainCheckBoxChecked = !this.doNotShowAgainCheckBoxChecked;
  }
}
