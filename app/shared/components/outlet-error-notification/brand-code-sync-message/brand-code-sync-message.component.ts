import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ObservableInput } from 'ngx-observable-input';
import { Observable, of, Subject, zip } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import {
  BusinessNameTableService
} from '../../../../traits/business-names/business-name-table/business-name-table.service';
import { GroupedBusinessName } from '../../../../traits/business-names/business-names.model';
import { BusinessNamesService } from '../../../../traits/business-names/business-names.service';
import { KeyTableService } from '../../../../traits/keys/key-table/key-table.service';
import { KeyType } from '../../../../traits/keys/key-type.model';
import { GroupedKey } from '../../../../traits/keys/key.model';
import { KeysService } from '../../../../traits/keys/keys.service';
import { AssignedBrandLabel } from '../../../../traits/label/assigned-brand-labels/assigned-brand-label';
import {
  AssignedBrandLabelTableService
} from '../../../../traits/label/assigned-brand-labels/assigned-brand-label-table/assigned-brand-label-table.service';
import {
  AssignedBrandLabelsService
} from '../../../../traits/label/assigned-brand-labels/assigned-brand-labels.service';
import { flatten } from '../../../util/arrays';

class BrandDependentItems {
  businessNames: GroupedBusinessName[] = [];
  assignedBrandLabels: AssignedBrandLabel[] = [];
  keys: GroupedKey[] = [];

  constructor(
    businessNames: GroupedBusinessName[],
    assignedBrandLabels: AssignedBrandLabel[],
    keys: GroupedKey[]
  ) {
    this.businessNames = businessNames;
    this.assignedBrandLabels = assignedBrandLabels;
    this.keys = keys;
  }
}

@Component({
  selector: 'gp-brand-code-sync-message',
  templateUrl: './brand-code-sync-message.component.html',
  styleUrls: ['./brand-code-sync-message.component.scss']
})
export class BrandCodeSyncMessageComponent implements OnInit, OnDestroy {
  @Input()
  @ObservableInput()
  businessSiteId: Observable<string>;
  @Input()
  markAsRegisteredOffice = false;
  @Input()
  link: string | undefined;
  @Input()
  checkFor: string | undefined = undefined;
  @Output()
  errorOccurred = new EventEmitter<boolean>(true);

  show = false;
  editPageLink = '';
  private missingBrandIds: string[] = [];
  private unsubscribe = new Subject<void>();

  constructor(
    private keysService: KeysService,
    private businessNameService: BusinessNamesService,
    private assignedBrandLabelService: AssignedBrandLabelsService,
    private keyTableService: KeyTableService,
    private businessNameTableService: BusinessNameTableService,
    private assignedLabelTableService: AssignedBrandLabelTableService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.init();
    this.keyTableService
      .saveKeys()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.init());

    this.businessNameTableService
      .saveNames()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.init());

    this.assignedLabelTableService
      .saveAssignedLabels()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.init());
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get registeredOfficeSuffix(): string {
    if (!this.markAsRegisteredOffice) {
      return '';
    }

    return (
      this.translateService.instant('OF') + ' ' + this.translateService.instant('REGISTERED_OFFICE')
    );
  }

  private init(): void {
    this.businessSiteId.pipe(takeUntil(this.unsubscribe)).subscribe((businessSiteId: string) => {
      this.show = false;
      if (businessSiteId) {
        this.setEditPageLink(businessSiteId);
        this.loadBrandDependentItems(businessSiteId);
      }
    });
  }

  private loadBrandDependentItems(businessSiteId: string): void {
    zip(
      this.getBusinessNameService(businessSiteId),
      this.getAssignedLabelService(businessSiteId),
      this.getKeysService(businessSiteId)
    )
      .pipe(
        map(
          ([businessNames, assignedBrandLabels, keys]) =>
            new BrandDependentItems(businessNames, assignedBrandLabels, keys)
        ),
        takeUntil(this.unsubscribe)
      )
      .subscribe((items: BrandDependentItems) => this.triggerShowMessage(items));
  }

  private getBusinessNameService(businessSiteId: string): Observable<GroupedBusinessName[]> {
    if (this.checkFor && this.checkFor !== 'businessNames') {
      return of([]);
    }
    return this.businessNameService.get(businessSiteId);
  }

  private getAssignedLabelService(businessSiteId: string): Observable<AssignedBrandLabel[]> {
    if (this.checkFor && this.checkFor !== 'assignedLabels') {
      return of([]);
    }
    return this.assignedBrandLabelService.getBrandLabelAssignments(businessSiteId);
  }

  private getKeysService(businessSiteId: string): Observable<GroupedKey[]> {
    return this.keysService.get(businessSiteId);
  }

  private triggerShowMessage(items: BrandDependentItems): void {
    const allBrandCodeBrandIds = items.keys
      .filter((key: GroupedKey) => key.type === KeyType.BRAND_CODE)
      .map((key: GroupedKey) => key.brands.map(brand => brand.brandId))
      .reduce(flatten, []);

    const allOtherBrandIds = [
      ...items.keys
        .filter(
          (key: GroupedKey) => key.type !== KeyType.BRAND_CODE
        )
        .map((key: GroupedKey) => key.brands.map(brand => brand.brandId))
        .reduce(flatten, []),
      ...items.businessNames
        .map((businessName: GroupedBusinessName) => businessName.brands.map(brand => brand.brandId))
        .reduce(flatten, []),
      ...items.assignedBrandLabels.map((assignedLabel: AssignedBrandLabel) => assignedLabel.brandId)
    ];

    const brandCodeMissing = !items.keys.some((val: GroupedKey) => val.type === KeyType.BRAND_CODE);
    this.missingBrandIds = allOtherBrandIds.filter(
      (brandId: string) => !allBrandCodeBrandIds.includes(brandId)
    );

    this.show = brandCodeMissing || this.missingBrandIds.length > 0;
    this.errorOccurred.emit(this.show);
  }

  private setEditPageLink(businessSiteId: string): void {
    this.editPageLink = '/outlet/' + businessSiteId + '/' + this.link;
  }
}
