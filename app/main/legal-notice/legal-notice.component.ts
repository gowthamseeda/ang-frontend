import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LegalService, LicenseEntry } from '../../shared/services/legal/legal.service';

@Component({
  selector: 'gp-legal-notice',
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.scss']
})
export class LegalNoticeComponent implements OnInit, OnDestroy {
  licenseEntries: LicenseEntry[];

  private unsubscribe = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<LegalNoticeComponent>,
    private legalService: LegalService
  ) {}

  ngOnInit(): void {
    this.legalService
      .getLicenses()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((licenseEntries: LicenseEntry[]) => {
        this.licenseEntries = licenseEntries;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
