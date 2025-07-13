import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-property-value-cell',
  templateUrl: './property-value-cell.component.html',
  styleUrls: ['./property-value-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyValueCellComponent implements OnInit {
  @Input()
  property: string;
  @Input()
  value: string;

  constructor() {}

  ngOnInit(): void {}
}
