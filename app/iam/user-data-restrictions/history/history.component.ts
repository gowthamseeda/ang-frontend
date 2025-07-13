import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { UserDataRestrictionMapperService } from '../../shared/services/user-data-restriction-mapper/user-data-restriction-mapper.service';
import { Histories, History } from '../services/history/history.model';
import { HistoryService } from '../services/history/history.service';
import { DataRestrictionType } from '../services/user-data-restrictions/data-restrictions-type.model';

export interface FocusLogTableRow {
  initiator: string;
  user: string;
  groupType: string;
  ignoreFocusProductGroup: boolean;
  createTimestamp: Date;
  activeProductGroups: string[];
  assignedDataRestrictions: AssignedDataRestriction;
}

export class AssignedDataRestriction {
  tenantDataRestrictions: string[];
  languageDataRestrictions: string[];
  countryDataRestrictions: string[];
  brandDataRestrictions: string[];
  productGroupDataRestrictions: string[];
  outletCategoryDataRestrictions: string[];
  outletDataRestrictions: string[];
  serviceDataRestrictions: string[];
}

@Component({
  selector: 'gp-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class HistoryComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input()
  userId: string;

  isLoading: boolean;
  focusLogTableRows: FocusLogTableRow[];
  focusDataSource = new MatTableDataSource<FocusLogTableRow>([]);
  expandedElement: History | null;

  focusTableColumns = [
    'initiator',
    'groupType',
    'ignoreFocusProductGroup',
    'activeProductGroups',
    'createTimestamp'
  ];

  private unsubscribe = new Subject<boolean>();

  constructor(
    private historyService: HistoryService,
    private userDataRestrictionMapperService: UserDataRestrictionMapperService
  ) {}

  ngAfterViewInit(): void {
    this.focusDataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  initLog(): void {
    this.isLoading = true;
    this.historyService
      .get(this.userId)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((histories: Histories) => {
        this.focusLogTableRows = histories.snapshots.map(
          snapshots =>
            ({
              initiator: snapshots.modifyUserId,
              groupType: snapshots.groupType,
              ignoreFocusProductGroup: snapshots.ignoreFocusProductGroup,
              activeProductGroups: this.getFocusProductGroupOrProductGroupRestriction(snapshots),
              createTimestamp: snapshots.createTimestamp,
              assignedDataRestrictions: this.getAssignedDataRestrictions(snapshots)
            } as FocusLogTableRow)
        );
        this.focusDataSource.data = this.focusLogTableRows || [];
      });
  }

  getAssignedDataRestrictions(snapshots: History): AssignedDataRestriction {
    return {
      tenantDataRestrictions: this.getDataRestrictionFrom(snapshots, DataRestrictionType.TENANT),
      languageDataRestrictions: this.getDataRestrictionFrom(
        snapshots,
        DataRestrictionType.LANGUAGE
      ),
      countryDataRestrictions: this.getDataRestrictionFrom(snapshots, DataRestrictionType.COUNTRY),
      brandDataRestrictions: this.getDataRestrictionFrom(snapshots, DataRestrictionType.BRAND),
      productGroupDataRestrictions: this.getDataRestrictionFrom(
        snapshots,
        DataRestrictionType.PRODUCTGROUP
      ),
      outletCategoryDataRestrictions: this.getDataRestrictionFrom(
        snapshots,
        DataRestrictionType.DISTRIBUTIONLEVEL
      ),
      outletDataRestrictions: this.getDataRestrictionFrom(
        snapshots,
        DataRestrictionType.BUSINESSSITE
      ),
      serviceDataRestrictions: this.getDataRestrictionFrom(snapshots, DataRestrictionType.SERVICE)
    } as AssignedDataRestriction;
  }

  getDataRestrictionFrom(snapshots: History, dataRestrictionType: DataRestrictionType): string[] {
    return this.userDataRestrictionMapperService.getDataRestrictionValues(
      snapshots.assignedDataRestrictions,
      dataRestrictionType
    );
  }

  private getFocusProductGroupOrProductGroupRestriction(snapshots: History): string[] {
    return snapshots.ignoreFocusProductGroup
      ? this.getDataRestrictionFrom(snapshots, DataRestrictionType.PRODUCTGROUP)
      : this.getDataRestrictionFrom(snapshots, DataRestrictionType.FOCUSPRODUCTGROUP);
  }
}
