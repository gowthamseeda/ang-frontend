import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { clone } from 'ramda';
import { noop } from 'rxjs';

import {
  outletInformationBaseData,
  outletInformationDefaultValue,
  outletInformationGeneralCommunication,
  outletInformationInvestors,
  outletInformationKeys,
  outletInformationLabels,
  outletInformationLegalInformation,
  outletInformationOthers,
  OutletInformationSection,
  outletInformationServices
} from '../../models/outlet-information.model';

@Component({
  selector: 'gp-outlet-information',
  templateUrl: './outlet-information.component.html',
  styleUrls: ['./outlet-information.component.scss']
})
export class OutletInformationComponent implements OnInit {
  default: OutletInformationSection = {};
  current: OutletInformationSection = {};
  columns = [
    [
      { label: 'BASE_DATA', outletInformation: outletInformationBaseData },
      { label: 'GENERAL_COMMUNICATION', outletInformation: outletInformationGeneralCommunication },
      { label: 'ADMIN_OUTLET_INFORMATION_KEYS', outletInformation: outletInformationKeys }
    ],
    [
      { label: 'BRAND_LABELS', outletInformation: outletInformationLabels },
      { label: 'LEGAL_INFO', outletInformation: outletInformationLegalInformation },
      { label: 'OFFERED_SERVICES', outletInformation: outletInformationServices },
      { label: 'ADMIN_OUTLET_INFORMATION_INVESTORS', outletInformation: outletInformationInvestors },
      { label: 'OTHERS', outletInformation: outletInformationOthers }
    ]
  ];

  constructor(
    public dialogRef: MatDialogRef<OutletInformationComponent>,
    @Inject(MAT_DIALOG_DATA) private data: string[]
  ) {
  }

  ngOnInit(): void {
    this.default = clone(outletInformationDefaultValue);
    this.flatten(this.default);
    this.setUnchecked(this.data);
  }

  flatten(section: OutletInformationSection): void {
    Object.keys(section).forEach(key => {
      if (section[key].outletInformation) {
        this.flatten(section[key].outletInformation);
      }
      this.current = {
        ...this.current,
        [key]: section[key]
      };
    });
  }

  setUnchecked(uncheckedKeys: string[]): void {
    uncheckedKeys.forEach(key => {
      this.current[key].value = false;
    });
  }

  setAll(key: string, checked: boolean, setParent: boolean = false): void {
    // Set children
    if (this.current[key].outletInformation) {
      Object.keys(this.current[key].outletInformation).forEach(childKey => {
        this.setAll(childKey, checked);
      });
    }
    // Set parent
    if (setParent && checked) {
      this.getHierarchy(this.default, key).slice(0, -1).forEach((k) => {
        !this.current[k].disabled ? this.current[k].value = checked : noop();
      });
    }
    !this.current[key].disabled ? this.current[key].value = checked : noop();
  }

  getHierarchy(base: OutletInformationSection, key: string, parent: string[] = []): string[] {
    let arr: string[] = [];
    Object.keys(base).forEach(k => {
      if (key === k) {
        arr = [...parent, key];
      } else {
        if (base[k].outletInformation) {
          const p = [...parent, k];
          arr = this.getHierarchy(base[k].outletInformation, key, p);
        }
      }
    });
    return arr;
  }

  update(): void {
    const uncheckedKeys: string[] = [];
    Object.keys(this.current).forEach(key => {
      const current = this.current[key];
      if (!current.disabled && !current.value) {
        uncheckedKeys.push(key);
      }
    });

    this.dialogRef.close(uncheckedKeys);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
