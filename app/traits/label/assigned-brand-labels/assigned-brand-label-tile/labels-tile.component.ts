import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ObservableInput } from 'ngx-observable-input';
import { combineLatest, Observable, Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';

import { BrandService } from '../../../../services/brand/brand.service';
import { Translatable } from '../../../../shared/pipes/translate-data/translatable.model';
import { sortByReference } from '../../../../shared/util/arrays';
import { AssignedBrandLabel } from '../assigned-brand-label';
import { AssignedBrandLabelsService } from '../assigned-brand-labels.service';

class GroupedLabel implements Translatable {
  labelId: number;
  name: string;
  translations?: { [key: string]: any };
  brandIds: string[];

  constructor(
    labelId: number,
    name: string,
    brandIds: string[],
    translations?: { [key: string]: any }
  ) {
    this.labelId = labelId;
    this.brandIds = brandIds;
    this.name = name;
    this.translations = translations;
  }
}

@Component({
  selector: 'gp-labels-tile',
  templateUrl: './labels-tile.component.html',
  styleUrls: ['./labels-tile.component.scss']
})
export class LabelsTileComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  outletId: string;
  @Input()
  @ObservableInput()
  authorized: Observable<Boolean>;
  detailsLinkText = '';

  isLoading: boolean;
  labels: GroupedLabel[];
  currentLanguage = this.translateService.currentLang;

  private unsubscribe = new Subject<void>();

  constructor(
    private assignedBrandLabelsService: AssignedBrandLabelsService,
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

  ngOnChanges(): void {
    this.isLoading = true;
    combineLatest([
      this.assignedBrandLabelsService.getBrandLabelAssignments(this.outletId),
      this.brandService.getAllIds().pipe(take(1))
    ])
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        ([labels, brandIds]) => (this.labels = this.getSortedGroupLabels(labels, brandIds))
      );
  }

  isEmpty(): Boolean {
    return this.labels === undefined || this.labels.length === 0;
  }

  @HostListener('wheel', ['$event'])
  avoidPageScroll(wheelEvent: WheelEvent): void {
    wheelEvent.stopPropagation();
  }

  private getSortedGroupLabels(labels: AssignedBrandLabel[], brandIds: string[]): GroupedLabel[] {
    const sortedLabels: GroupedLabel[] = [];
    const groupedLabelMap = this.toGroupedLabelMap(labels);

    Array.from(groupedLabelMap.values()).forEach(label => {
      const sortedBrandIds = sortByReference<string, string>(
        label.brandIds,
        brandIds,
        (elem: string) => elem
      );
      sortedLabels.push(
        new GroupedLabel(label.labelId, label.name, sortedBrandIds, label.translations)
      );
    });

    return sortedLabels;
  }

  private toGroupedLabelMap(labels: AssignedBrandLabel[]): Map<number, GroupedLabel> {
    return labels.reduce((labelMap: Map<number, GroupedLabel>, label: AssignedBrandLabel) => {
      const exitingLabel = labelMap.get(label.labelId);

      if (exitingLabel) {
        exitingLabel.brandIds.push(label.brandId);
      } else {
        labelMap.set(
          label.labelId,
          new GroupedLabel(label.labelId, label.name, [label.brandId], label.translations)
        );
      }
      return labelMap;
    }, new Map<number, GroupedLabel>());
  }
}
