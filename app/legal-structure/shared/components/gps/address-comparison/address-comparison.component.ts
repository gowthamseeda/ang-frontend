import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'gp-address-comparison',
  templateUrl: './address-comparison.component.html',
  styleUrls: ['./address-comparison.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressComparisonComponent {
  @Input()
  mismatchAddress: any;

  constructor() {}
}
