import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterContentInit,
    Component,
    ContentChildren,
    Input,
    OnChanges,
    QueryList,
    ViewChild
} from '@angular/core';
import { MatColumnDef, MatTable } from '@angular/material/table';

@Component({
  selector: 'gp-expandable-table',
  templateUrl: './expandable-table.component.html',
  styleUrls: ['./expandable-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class ExpandableTableComponent implements OnChanges, AfterContentInit {
  @Input()
  columnsToDisplay: string[];
  @Input()
  data: any[];

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
  dataSource: { show: boolean; row: any }[];

  constructor() {}

  ngOnChanges(): void {
    this.dataSource = this.data.map(item => ({
      row: item,
      show: false
    }));
  }

  ngAfterContentInit(): void {
    this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
  }
}
