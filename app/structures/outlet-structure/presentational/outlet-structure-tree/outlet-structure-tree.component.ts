import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, ContentChild, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { Company } from '../../model/company.model';
import { OutletStructureService } from '../../services/outlet-structure.service';

import { FlatStructureNode } from './model/flat-structure-node.model';

@Component({
  selector: 'gp-outlet-structure-tree',
  templateUrl: './outlet-structure-tree.component.html',
  styleUrls: ['./outlet-structure-tree.component.scss']
})
export class OutletStructureTreeComponent implements OnDestroy, OnInit {
  outlets: Observable<FlatStructureNode[]>;
  company: Observable<Company | undefined>;
  scrollingAllowed: boolean;

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @ContentChild('nodeComponent') nodeContentComponent: any;

  private unsubscribe = new Subject<void>();

  constructor(private storeService: OutletStructureService) {
    this.company = this.storeService.getCompany();
    this.outlets = this.storeService.getFlattenOutlets();
  }

  onScrollIndexChange(outletIndex: number): void {
    this.setScrollingAllowed(outletIndex > 0 ? true : false);
  }

  ngOnInit(): void {
    this.storeService
      .getSelectedOutletIndex()
      .pipe(
        takeUntil(this.unsubscribe),
        filter(index => index >= 0),
        distinctUntilChanged()
      )
      .subscribe(outletIndex => {
        this.scrollVisible(outletIndex, 10);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private scrollVisible(outletIndex: number, retry: number): void {
    if (this.isScrollingAllowed()) {
      this.virtualScroll.scrollToIndex(outletIndex, 'auto');
    } else if (retry === 0) {
      this.setScrollingAllowed(true);
      this.scrollVisible(outletIndex, retry);
    } else {
      setTimeout(() => this.scrollVisible(outletIndex, --retry), 500);
    }
  }

  private setScrollingAllowed(allowed: boolean): void {
    this.scrollingAllowed = allowed;
  }

  private isScrollingAllowed(): boolean {
    return this.scrollingAllowed;
  }
}
