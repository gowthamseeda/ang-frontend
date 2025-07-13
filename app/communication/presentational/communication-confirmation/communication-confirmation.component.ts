import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Service } from '../../../services/service/models/service.model';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import {UserSettingsService} from "../../../user-settings/user-settings/services/user-settings.service";

interface ServiceWithBrands extends Service {
  brandIds: string[];
}

@Component({
  selector: 'gp-communication-confirmation',
  templateUrl: './communication-confirmation.component.html',
  styleUrls: ['./communication-confirmation.component.scss']
})
export class CommunicationConfirmationComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['service', 'brands', 'productGroups'];
  dataSource: ServiceWithBrands[];
  blockDataSource: ServiceWithBrands[];
  doNotShowAgainCheckBoxChecked: boolean = false;

  private unsubscribe = new Subject<void>();

  constructor(
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<CommunicationConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      communicationBlockData: any;
      communicationData: any;
      noChangeCommunicationData: any;
      blockServices: Service[];
      services: Service[];
      outletId: string;
    },
    private userSettingsService: UserSettingsService
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.dataSource = this.data.services.map(service => {
      return {
        ...service,
        brandIds: this.distinctList(service.brandProductGroups?.map(x => x.brandId)) ?? []
      };
    });

    this.blockDataSource = this.data.blockServices.map(service => {
      return {
        ...service,
        brandIds: this.distinctList(service.brandProductGroups?.map(x => x.brandId)) ?? []
      };
    });
  }

  save(): void {
    this.userSettingsService
      .updateUserDoNotShowMultiSelectConfirmationDialog(this.doNotShowAgainCheckBoxChecked)
      .pipe(
        finalize(() => {
          this.dialogRef.close(true);
        })
      )
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

  doNotShowAgainCheckBoxChange() : void {
    this.doNotShowAgainCheckBoxChecked = !this.doNotShowAgainCheckBoxChecked;
  }

  getProductGroupIds(service: string, brandId: string): string[] {
    return (
      this.dataSource
        .find(data => data.name == service)
        ?.brandProductGroups?.filter(x => x.brandId == brandId)
        .map(x => x.productGroupId) || []
    );
  }

  getBlockProductGroupIds(service: string, brandId: string): string[] {
    return (
      this.blockDataSource
        .find(data => data.name == service)
        ?.brandProductGroups?.filter(x => x.brandId == brandId)
        .map(x => x.productGroupId) || []
    );
  }
}
