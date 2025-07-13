import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { BrandProductGroup } from '../../../brand-product-group/brand-product-group.model';
import { ProductGroup } from '../../../product-group/product-group.model';
import { ProductGroupService } from '../../../product-group/product-group.service';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';

@Component({
  selector: 'gp-product-group',
  templateUrl: './product-group.component.html',
  styleUrls: ['./product-group.component.scss']
})
export class ProductGroupComponent implements OnInit {
  @Input() brandId: string;
  @Input() productGroupId: string;
  @Input() countryId: string;
  @Input() arrowUpEnabled = false;
  @Input() arrowDownEnabled = false;
  @Input() readOnly = false;
  @Input() permissions: string[] = [];
  @Input() tooltipPosition = 'after';
  @Input() size = 'default';
  @Input() color = 'petrol';
  @Input() isHover = false;
  @Output() arrowUpClick: EventEmitter<BrandProductGroup> = new EventEmitter<BrandProductGroup>();
  @Output() arrowDownClick: EventEmitter<BrandProductGroup> = new EventEmitter<BrandProductGroup>();

  userHasPermission: Observable<boolean>;
  tooltip: Observable<string>;

  constructor(
    private userAuthorizationService: UserAuthorizationService,
    private distributionLevelsDataService: DistributionLevelsService,
    private productGroupService: ProductGroupService,
    private userSettingsService: UserSettingsService
  ) {
  }

  ngOnInit(): void {
    this.evaluateUserPermissions();

    this.tooltip = combineLatest([
      this.productGroupService.getAll(),
      this.userSettingsService.getLanguageId()
    ]).pipe(
      map(([productGroups, languageId]) => this.findTooltip(productGroups, languageId))
    );
  }

  emitArrowUpClick(): void {
    this.arrowUpClick.emit({
      brandId: this.brandId,
      productGroupId: this.productGroupId
    } as BrandProductGroup);
  }

  emitArrowDownClick(): void {
    this.arrowDownClick.emit({
      brandId: this.brandId,
      productGroupId: this.productGroupId
    } as BrandProductGroup);
  }

  getColor(): string {
    return this.isHover? 'white': this.color
  }

  private evaluateUserPermissions(): void {
    if (!this.brandId) {
      this.userHasPermission = of(true);
    } else {
      this.userHasPermission = this.distributionLevelsDataService
        .getDistributionLevelsOfOutlet()
        .pipe(
          shareReplay(1),
          switchMap(distributionLevels => {
            let authorizedFor = this.userAuthorizationService.isAuthorizedFor
              .permissions(this.permissions)
              .distributionLevels(distributionLevels);
            if (this.brandId !== undefined && this.brandId !== 'BRANDLESS') {
              authorizedFor = authorizedFor.brand(this.brandId);
            }
            if (this.productGroupId !== undefined && this.productGroupId !== 'PRODUCTGROUPLESS') {
              authorizedFor = authorizedFor.productGroup(this.productGroupId);
            }
            if (this.countryId !== undefined) {
              authorizedFor = authorizedFor.country(this.countryId);
            }

            return authorizedFor.verify();
          })
        );
    }
  }

  private findTooltip(productGroups: ProductGroup[], userLanguage: string | undefined): string {
    const currentProductGroup = productGroups
      ?.find(
        (productGroup: ProductGroup) => (productGroup.id.toLowerCase() === this.productGroupId.toLowerCase())
      );

    let translation: string | undefined;
    if (currentProductGroup?.translations && userLanguage) {
      const key = Object
        .keys(currentProductGroup.translations)
        .find(item => item === userLanguage);
      translation = key ? currentProductGroup.translations[key].name : null;
    }

    return translation ?? currentProductGroup?.name ?? '';
  }
}
