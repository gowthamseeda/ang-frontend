import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ObservableInput } from 'ngx-observable-input';
import { Observable, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

import {
  DuplicateFederalIdResource,
  DuplicateFederalIdsResource,
  FederalIdService
} from '../../../../traits/keys/federal-id/federal-id.service';
import { KeyTableService } from '../../../../traits/keys/key-table/key-table.service';
import {
  BrandCodeService,
  DuplicateBrandCodeResource,
  DuplicateBrandCodesResource
} from '../../../../traits/shared/brand-code/brand-code.service';
import { DuplicateKeyTypes } from '../duplicate-key-types.model';

@Component({
  selector: 'gp-duplicate-keys-message',
  templateUrl: './duplicate-keys-message.component.html',
  styleUrls: ['./duplicate-keys-message.component.scss']
})
export class DuplicateKeysMessageComponent implements OnInit, OnDestroy {
  @Input()
  @ObservableInput()
  businessSiteId: Observable<string>;
  @Input()
  link: string | undefined;
  @Output()
  errorOccurred = new EventEmitter<{ type: DuplicateKeyTypes; value: boolean }>();

  duplicateBrandCodes = new Map<string, string[]>();
  duplicateAdamIds = new Map<string, string[]>();
  duplicateFederalIds = new Map<string, string[]>();
  pageLink = '';
  _businessSiteId: string;
  private unsubscribe = new Subject<void>();

  constructor(
    private brandCodeService: BrandCodeService,
    private federalIdService: FederalIdService,
    private keyTableService: KeyTableService
  ) {}

  ngOnInit(): void {
    this.subscribeToKeyChanges();
    this.businessSiteId.pipe(takeUntil(this.unsubscribe)).subscribe((businessSiteId: string) => {
      this._businessSiteId = businessSiteId;
      this.loadDuplicates();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadDuplicates(): void {
    this.loadDuplicateBrandCodes(this._businessSiteId);
    this.loadDuplicateFederalIds(this._businessSiteId);
  }

  private loadDuplicateBrandCodes(businessSiteId: string): void {
    this.duplicateBrandCodes.clear();

    this.brandCodeService
      .getDuplicateBrandCodesBy(businessSiteId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((duplicates: DuplicateBrandCodesResource) => {
        if (duplicates) {
          duplicates.duplicateBrandCodes
            .filter(
              (brandCode, pos, duplicateBrandCodes) =>
                duplicateBrandCodes.indexOf(brandCode) === pos
            )
            .forEach((duplicateBrandCode: DuplicateBrandCodeResource) =>
              this.duplicateBrandCodes.set(duplicateBrandCode.businessSiteId, [
                duplicateBrandCode.brandCode
              ])
            );
        }

        if (this.duplicateBrandCodes.size > 0) {
          this.pageLink = '/outlet/' + this._businessSiteId + '/' + this.link;
          this.errorOccurred.emit({ type: DuplicateKeyTypes.BrandCodes, value: true });
        } else {
          this.errorOccurred.emit({ type: DuplicateKeyTypes.BrandCodes, value: false });
        }
      });
  }

  private loadDuplicateFederalIds(businessSiteId: string): void {
    this.duplicateFederalIds.clear();

    this.federalIdService
      .getDuplicateFederalIdsBy(businessSiteId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((duplicates: DuplicateFederalIdsResource) => {
        if (duplicates) {
          duplicates.duplicateFederalIds.forEach((duplicateFederalId: DuplicateFederalIdResource) =>
            this.duplicateFederalIds.set(duplicateFederalId.businessSiteId, [
              duplicateFederalId.federalId
            ])
          );
        }

        if (this.duplicateFederalIds.size > 0) {
          this.pageLink = '/outlet/' + this._businessSiteId + '/' + this.link;
          this.errorOccurred.emit({ type: DuplicateKeyTypes.FederalId, value: true });
        } else {
          this.errorOccurred.emit({ type: DuplicateKeyTypes.FederalId, value: false });
        }
      });
  }

  private subscribeToKeyChanges(): void {
    this.keyTableService
      .saveKeys()
      .pipe(delay(1000), takeUntil(this.unsubscribe))
      .subscribe(() => this.loadDuplicates());
  }
}
