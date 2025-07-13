import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { StructuresMember } from '../../models/shared.model';

import { TranslateCountryPipe } from './../../../../shared/pipes/translate-country/translate-country.pipe';

const columnsWithCancel = ['legalName', 'address', 'brandCode', 'type', 'cancel'];
const columnsWithoutCancel = ['legalName', 'address', 'brandCode', 'type'];
@Component({
  selector: 'gp-members-table',
  templateUrl: './members-table.component.html',
  styleUrls: ['./members-table.component.scss'],
  providers: [TranslateCountryPipe]
})
export class MembersTableComponent implements OnInit, OnChanges {
  @Input() members: StructuresMember[] = [];
  @Input() disabled = false;
  @Input() hideHeader = false;
  @Input() nonRoMember = false;
  @Input() readOnly = true;
  @Input() sortEvent: MatSort;
  @Input() filterValue: string;
  @Output() memberRemoved = new EventEmitter<string>();

  displayedColumns: string[];
  dataSource = new MatTableDataSource<StructuresMember>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private translateCountryPipe: TranslateCountryPipe
  ) {}

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: StructuresMember, property) => {
      switch (property) {
        case 'legalName':
          return `${item.legalName}${item.companyId}${item.id}`;
        case 'address':
          return `${item.address.street}${item.address.streetNumber}`;
        case 'type':
          return item.isRegisteredOffice;
        default:
          return item[property];
      }
    };
    this.initTableFilterPredicate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource.data = [...this.members];

    this.dataSource.data.map((element, index) => {
      this.translateCountryPipe.transform(element.country.id).subscribe(val =>
        this.dataSource.data[index].country.name = val
      );
    });

    if (this.readOnly || this.disabled) {
      this.displayedColumns = columnsWithoutCancel;
    } else {
      this.displayedColumns = columnsWithCancel;
    }
    if (this.nonRoMember && this.dataSource.data.length > 1) {
      this.triggerSort(this.sortEvent);
    }

    if (changes.filterValue) {
      this.filterTable(this.filterValue || '');
    }
  }

  removeMember(memberId: string): void {
    this.memberRemoved.emit(memberId);
  }

  filterTable(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private triggerSort(sort: MatSort): void {
    if (sort) {
      const sortChangeEvent = { active: sort.active, direction: sort.direction };
      this.sort.active = sortChangeEvent.active;
      this.sort.direction = sortChangeEvent.direction;
      this.sort.sortChange.emit(sortChangeEvent);
    }
  }

  private initTableFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: StructuresMember, filter: string) => {
      const filterCondition = this.buildFilterCondition(data, filter);
      return filterCondition.some(condition => condition);
    };
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

    const brandCodes = member.brandCodes?.map(bc => bc.brandCode) || [];

    return [
      outletInfo.includes(filter),
      address.includes(filter),
      brandCodes.some((code: string) => code.toLowerCase().includes(filter))
    ];
  }
}
