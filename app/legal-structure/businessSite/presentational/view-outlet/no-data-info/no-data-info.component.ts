import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-no-data-info',
  templateUrl: './no-data-info.component.html',
  styleUrls: ['./no-data-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoDataInfoComponent implements OnInit {
  @Input()
  noDataInfo: string;
  @Input()
  noDataInfoPrefix: string;
  @Input()
  noDataInfoLink: string;
  @Input()
  noDataInfoPostfix: string;

  constructor() {}

  ngOnInit(): void {}
}
