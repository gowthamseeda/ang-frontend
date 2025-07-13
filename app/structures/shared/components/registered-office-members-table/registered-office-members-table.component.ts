import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { TranslateCountryPipe } from '../../../../shared/pipes/translate-country/translate-country.pipe';
import { BrandCode } from '../../../../traits/shared/brand-code/brand-code.model';
import { DealerGroupMember, DealerGroupMemberWithRO } from '../../../models/dealer-group.model';
import { StructuresMember } from '../../models/shared.model';

const columnsWithCancel = ['expansionIndicator', 'legalName', 'address', 'brandCode', 'type', 'cancel'];
const columnsWithoutCancel = ['expansionIndicator', 'legalName', 'address', 'brandCode', 'type'];

@Component({
  selector: 'gp-registered-office-members-table',
  templateUrl: './registered-office-members-table.component.html',
  styleUrls: ['./registered-office-members-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
  providers: [TranslateCountryPipe]
})
export class RegisteredOfficeMembersTableComponent implements OnInit, OnChanges {
  @Input() membersWithRO: DealerGroupMemberWithRO[] = [];
  @Input() membersWithoutRO: DealerGroupMember[] = [];
  @Input() disabled = false;
  @Input() readOnly = true;
  @Output() memberRemoved = new EventEmitter<string>();
  @Output() memberWithRORemoved = new EventEmitter<string>();
  @Output() sortChangeEvent = new EventEmitter<MatSort>();
  @Output() filterEvent = new EventEmitter<string>();

  displayedColumns: string[];
  dataSource = new MatTableDataSource<{ show: boolean; row: StructuresMember }>();
  expandedOutletIdList: string[] = [];

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private translateCountryPipe: TranslateCountryPipe
  ) {}

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'legalName':
          return `${item.row.legalName}${item.row.companyId}${item.row.id}`;
        case 'address':
          return `${item.row.address.street}${item.row.address.streetNumber}`;
        case 'type':
          return item.row.isRegisteredOffice;
        default:
          return item.row[property];
      }
    };

    this.initTableFilterPredicate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.readOnly || this.disabled) {
      this.displayedColumns = columnsWithoutCancel;
    } else {
      this.displayedColumns = columnsWithCancel;
    }
    if (
      this.membersWithRO &&
      changes.membersWithRO &&
      this.membersWithRO !== changes.membersWithRO.previousValue
    ) {
      this.dataSource.data = this.membersWithRO.map(member => this.generateDataSource(member));
    }

    this.dataSource.data.map((element, index) => {
      this.translateCountryPipe.transform(element.row.country.id).subscribe(val =>
        this.dataSource.data[index].row.country.name = val
      );
    });
  }

  removeMemberWithRO(outletId: string): void {
    this.updateExpandedOutletIdList(outletId, false);
    this.memberWithRORemoved.emit(outletId);
  }

  removeMember(outletId: string): void {
    this.memberRemoved.emit(outletId);
  }

  getROMemberDetails(outletId: string): StructuresMember[] | undefined {
    return this.membersWithRO.find(member => member.registeredOffice.id === outletId)?.members;
  }

  isExpandable(outletId: string): boolean {
    const roMembers = this.getROMemberDetails(outletId);
    return roMembers ? roMembers.length > 0 : false;
  }

  showDetail(element: any): void {
    if (this.isExpandable(element.row.id)) {
      element.show = !element.show;
      this.updateExpandedOutletIdList(element.row.id, element.show);
    }
  }

  sortChange(event: any): void {
    this.sortChangeEvent.emit(event);
  }

  filterTable(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.filterEvent.emit(filterValue);
  }

  private updateExpandedOutletIdList(businessSiteId: string, isExpand: boolean): void {
    if (isExpand) {
      this.expandedOutletIdList.push(businessSiteId);
      return;
    }

    this.expandedOutletIdList = this.expandedOutletIdList.filter(
      outletId => outletId !== businessSiteId
    );
  }

  private generateDataSource(dealerGroupMemberWithRO: DealerGroupMemberWithRO): any {
    if (dealerGroupMemberWithRO.members.length === 0) {
      this.updateExpandedOutletIdList(dealerGroupMemberWithRO.registeredOffice.id, false);
    }
    const data: any = {};
    data.show = this.isExpanded(dealerGroupMemberWithRO.registeredOffice.id);
    data.row = dealerGroupMemberWithRO.registeredOffice;
    return data;
  }

  private isExpanded(businessSiteId: string): boolean {
    return this.expandedOutletIdList.some(outletId => outletId === businessSiteId);
  }

  private initTableFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const registeredOffice: StructuresMember = data.row;

      const filterCondition = this.buildFilterCondition(registeredOffice, filter);

      return filterCondition.some(condition => condition) || this.matchAnyROMember(registeredOffice, filter);
    };
  }

  private matchAnyROMember(registeredOffice: StructuresMember, filter: string): boolean {
    if (!registeredOffice.isRegisteredOffice) {
      return false;
    }
    const members = this.getROMemberDetails(registeredOffice.id) || [];

    return members.some(member => {
      const filterCondition = this.buildFilterCondition(member, filter);
      return filterCondition.some(condition => condition);
    });
  }

  private buildFilterCondition(member: StructuresMember, filter: string): boolean[] {
    const outletInfo = [member.legalName, member.companyId, member.id]
      .join(' ')
      .trim()
      .toLowerCase();
    const address = [
      member.address?.street,
      member.address?.streetNumber,
      member.address?.city,
      member.country?.name
    ]
      .filter(addr => addr)
      .join(' ')
      .trim()
      .toLowerCase();

    const brandCodes = member.brandCodes?.map((bc: BrandCode) => bc.brandCode) || [];

    return [
      outletInfo.includes(filter),
      address.includes(filter),
      brandCodes.some((code: string) => code.toLowerCase().includes(filter))
    ];
  }
}
