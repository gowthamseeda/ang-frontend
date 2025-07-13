import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SisterOutlet } from '../../models/sister-outlet.model';
import { map } from 'rxjs';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { OfferedService } from '../../../offered-service/offered-service.model';

export interface CopyToCompanyDialogData {
  selectedOutletIdsToCopy: string[];
  companyId: string;
  serviceIds: number[];
  selfOutletId: string;
}

@Component({
  selector: 'gp-select-outlets-dialog',
  templateUrl: './select-outlets-dialog.component.html',
  styleUrls: ['./select-outlets-dialog.component.scss']
})
export class SelectOutletsDialogComponent implements OnInit {
  outlets: SisterOutlet[] = [];
  allOutletOfferedServices: OfferedService[] = [];

  selectedOutlets: string[] = [];

  selectAll: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SelectOutletsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CopyToCompanyDialogData,
    private offeredServiceService: OfferedServiceService
  ) {}

  ngOnInit(): void {
    this.selectedOutlets = this.data.selectedOutletIdsToCopy;
    this.initSisterOutlets();
  }

  onSelectOutlet(outletId: string) {
    if (this.selectedOutlets.includes(outletId)) {
      this.selectedOutlets = this.selectedOutlets.filter(outlet => outlet !== outletId);
    } else {
      this.selectedOutlets.push(outletId);
    }

    if (this.selectedOutlets.length === this.outlets.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
  }

  onSelectAllChange() {
    this.selectAll = !this.selectAll;
    const tempList: string[] = [];

    if (this.selectAll) {
      this.outlets.map(outlet => {
        tempList.push(outlet.id);
      });
    }
    this.selectedOutlets = tempList;
  }

  initSisterOutlets() {
  this.offeredServiceService.fetchCompanySisterOutlets(this.data.companyId, this.data.serviceIds);
  this.offeredServiceService
    .getCompanySisterOutletsFullResponse()
    .pipe(
      map(response => {
        const sisterOutlets = response.sisterOutlets.filter(
          sisterOutlet => sisterOutlet.id !== this.data.selfOutletId
        );
         const offeredServices = response.offeredServices
          ? response.offeredServices.filter(
              service => service?.businessSite?.id !== this.data.selfOutletId
            )
          : [];
        return {
          sisterOutlets,
          offeredServices
        };
      })
    )
    .subscribe(({ sisterOutlets, offeredServices }) => {
      this.outlets = sisterOutlets;
      this.allOutletOfferedServices = offeredServices;
     
      if (this.selectedOutlets.length === sisterOutlets.length) {
        this.selectAll = true;
      } else {
        this.selectAll = false;
      }
    });
  }

  onSave() {
    const selectedOutletOfferedServices = this.allOutletOfferedServices.filter(service =>
      service.businessSite?.id && this.selectedOutlets.includes(service.businessSite.id)
    );
    this.dialogRef.close({
      selectedOutletIdsToCopy: this.selectedOutlets,
      selectedOutletOfferedServices
    });
  }

  onCancel() {
    const selectedOutletOfferedServices = this.allOutletOfferedServices.filter(service =>
      service.businessSite?.id && this.data.selectedOutletIdsToCopy.includes(service.businessSite.id)
    );
    this.dialogRef.close({
      selectedOutletIdsToCopy: this.data.selectedOutletIdsToCopy,
      selectedOutletOfferedServices
    });
  }
}
