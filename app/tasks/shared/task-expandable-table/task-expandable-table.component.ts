import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  ViewChild
} from '@angular/core';
import { MatColumnDef, MatTable } from '@angular/material/table';

import { AppStateService } from '../../../shared/services/state/app-state-service';

@Component({
  selector: 'gp-task-expandable-table',
  templateUrl: './task-expandable-table.component.html',
  styleUrls: ['./task-expandable-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class TaskExpandableTableComponent implements OnChanges, AfterContentInit {
  @Input()
  columnsToDisplay: string[];
  @Input()
  data: any[];
  @Output()
  saveExpandedStatus = new EventEmitter<any>();

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
  dataSource: { show: boolean; row: any }[];

  constructor(private appStateService: AppStateService) {}

  ngOnChanges(): void {
    this.dataSource = this.data.map(item => ({
      row: item,
      show: this.getExpandedStatusBy(item)
    }));
  }

  ngAfterContentInit(): void {
    this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
  }

  click(row: any): void {
    row.show = !row.show;
    this.saveExpandedStatus.emit(row);
  }

  private getExpandedStatusBy(item: any): boolean {
    const expandedTaskBusinessSiteIds =
      this.appStateService.get('expandedTaskBusinessSiteIds') || [];

    return expandedTaskBusinessSiteIds.length
      ? expandedTaskBusinessSiteIds.some(
          (businessSiteId: string) => businessSiteId === item.businessSite.businessSiteId
        )
      : false;
  }
}
