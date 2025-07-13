import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { RegionalCenterViewState } from '../../container/view-regional-centers/view-regional-centers.component.state';

@Component({
  selector: 'gp-regional-center-table',
  templateUrl: './regional-center-table.component.html',
  styleUrls: ['./regional-center-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegionalCenterTableComponent implements OnChanges {
  @Input()
  regionalCenters: RegionalCenterViewState[] = [];
  @Input()
  languageId: string;
  readonly displayedColumns: string[] = ['name', 'country', 'address', 'brand', 'type', 'category'];

  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.regionalCenters) {
      this.dataSource.data = changes.regionalCenters.currentValue;
      this.dataSource.sort = this.sort;
    }
  }
}
