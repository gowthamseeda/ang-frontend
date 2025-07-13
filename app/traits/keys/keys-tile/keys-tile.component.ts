import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ObservableInput } from 'ngx-observable-input';
import { combineLatest, Observable, Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';

import { BrandService } from '../../../services/brand/brand.service';
import { sortByReference } from '../../../shared/util/arrays';
import { Brand } from '../../brand.model';
import { KeyType } from '../key-type.model';
import { GroupedKey } from '../key.model';
import { KeysService } from '../keys.service';

@Component({
  selector: 'gp-keys-tile',
  templateUrl: './keys-tile.component.html',
  styleUrls: ['./keys-tile.component.scss']
})
export class KeysTileComponent implements OnInit, OnDestroy {
  @Input()
  @ObservableInput()
  authorized: Observable<Boolean>;
  isLoading: boolean;
  keys: GroupedKey[] = [];
  detailsLinkText = '';

  @Input()
  get outletId(): string {
    return this.localOutletId;
  }
  set outletId(outletId: string) {
    this.localOutletId = outletId;
    if (outletId) {
      this.initKeys();
    }
  }

  @Input()
  get countryId(): string {
    return this.localCountryId;
  }
  set countryId(countryId: string) {
    this.localCountryId = countryId;
    if (this.localOutletId && this.localCountryId) {
      this.initKeys();
    }
  }

  private localOutletId: string;
  private localCountryId: string;
  private unsubscribe = new Subject<void>();

  constructor(
    private keysService: KeysService,
    private brandService: BrandService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.authorized.pipe(takeUntil(this.unsubscribe)).subscribe(authorized => {
      this.detailsLinkText = authorized
        ? this.translateService.instant('TILE_DETAILS_EDIT')
        : this.translateService.instant('TILE_DETAILS');
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initKeys(): void {
    this.isLoading = true;

    combineLatest([
      this.keysService.get(this.outletId, this.countryId),
      this.brandService.getAllIds()
    ])
      .pipe(
        take(1),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(([keys, brandIds]) => {
        this.keys = this.getSortedGroupedKeys(keys, brandIds);
      });
  }

  isEmpty(): Boolean {
    return this.keys.length === 0;
  }

  @HostListener('wheel', ['$event'])
  avoidPageScroll(wheelEvent: WheelEvent): void {
    wheelEvent.stopPropagation();
  }

  hasBrandCode(): Boolean {
    return this.keys.some((val: GroupedKey) => val.type === KeyType.BRAND_CODE);
  }

  private getSortedGroupedKeys(groupedKeys: GroupedKey[], brandIds: string[]): GroupedKey[] {
    const sortedKeys: GroupedKey[] = [];
    groupedKeys.forEach(key => {
      const sortedBrandIds = sortByReference<string, string>(
        key.brands.map(brand => brand.brandId),
        brandIds,
        (elem: string) => elem
      );
      const sortedBrands = sortedBrandIds.map(brandId => new Brand(brandId));
      sortedKeys.push(new GroupedKey(key.type, key.key, sortedBrands));
    });
    return sortedKeys;
  }
}
