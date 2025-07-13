import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Service } from '../../../service/models/service.model';
import { Validity, ValidityTableRow } from '../../validity.model';
import { UserSettingsService } from "../../../../user-settings/user-settings/services/user-settings.service";
import {finalize} from "rxjs/operators";
import {SnackBarService} from "../../../../shared/services/snack-bar/snack-bar.service";

interface BrandProductGroupWithValidity {
  brandId: string;
  productGroupId: string;
  outletId?: string;
  validFrom: string | null;
  validUntil: string | null;
  validity: Validity;
}

interface ServiceWithBrands extends Service {
  brandIds: string[];
  brandProductGroupsWithValidity: BrandProductGroupWithValidity[];
}

@Component({
  selector: 'gp-validity-confirmation',
  templateUrl: './validity-confirmation.component.html',
  styleUrls: ['./validity-confirmation.component.scss']
})
export class ValidityConfirmationComponent implements OnInit {
  displayedColumns: string[] = ['service', 'brands', 'productGroups', 'validFrom', 'validUntil'];
  validRecords : ServiceWithBrands[];
  invalidRecords : ServiceWithBrands[] ;
  doNotShowAgainCheckBoxChecked: boolean = false;
  outletIds: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ValidityConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: { validityTableRow: ValidityTableRow; services: Service[]; outletIds: string[] },
    private userSettingsService: UserSettingsService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.outletIds = this.data.outletIds;
    const dataSource = this.data.services.map(service => {
      const brandProductGroupsWithValidity = (service.brandProductGroups ?? [])
      .map(brandProductGroup => {
        const validities = Object.values(this.data.validityTableRow.offeredServicesMap).filter(
          offeredService =>
            offeredService.serviceId == service.id &&
            offeredService.brandId == brandProductGroup.brandId &&
            offeredService.productGroupId == brandProductGroup.productGroupId
          );
          return validities.map(validity => {
            let validUntil = validity?.validity?.validUntil;
            if (validUntil === undefined || validUntil === null || validUntil === '') {
              validUntil = this.data.validityTableRow.validUntil ?? null;
            }
            return {
              brandId: brandProductGroup.brandId,
              productGroupId: brandProductGroup.productGroupId,
              outletId: validity.businessSite?.id || this.outletIds[0],
              validFrom: validity?.validity?.validFrom || null,
              validUntil: validUntil,
              validity: {
                ...validity.validity,
                validUntil: validUntil
              }
            };
          });
        })
        .reduce((acc, val) => acc.concat(val), []);

        return {
          ...service,
          brandProductGroupsWithValidity,
          brandIds: this.distinctList(service.brandProductGroups?.map(x => x.brandId)) ?? []
        };
      }) as ServiceWithBrands[];
       
      this. splitRecordsByValidity(dataSource);
  }

  private splitRecordsByValidity(dataSource: ServiceWithBrands[]): void {
    this.validRecords = [];
    this.invalidRecords = [];

    dataSource.forEach(service => {
      const validGroups: BrandProductGroupWithValidity[] = [];
      const invalidGroups: BrandProductGroupWithValidity[] = [];

      service.brandProductGroupsWithValidity.forEach(group => {
        const validFrom = group.validFrom ? new Date(group.validFrom) : null;
        const validUntil = group.validUntil ? new Date(group.validUntil) : null;
        if ((validFrom && validUntil && validFrom <= validUntil) || (validFrom && !validUntil)) {
          validGroups.push(group);
        } else {
          invalidGroups.push(group);
        }
      });

      if (validGroups.length > 0) {
        this.validRecords.push({ ...service, brandProductGroupsWithValidity: validGroups });
      }
      if (invalidGroups.length > 0) {
        this.invalidRecords.push({ ...service, brandProductGroupsWithValidity: invalidGroups });
      }
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

  doNotShowAgainCheckBoxChange() : void {
    this.doNotShowAgainCheckBoxChecked = !this.doNotShowAgainCheckBoxChecked;
  }

  getOutletIdsFromRecords(records: ServiceWithBrands[]): string[] {
    const outletIdSet = new Set<string>();
    records.forEach(service =>
      service.brandProductGroupsWithValidity.forEach(group => {
        if (group.outletId) {
          outletIdSet.add(group.outletId);
        }
      })
    );
    return Array.from(outletIdSet);
  }
}
