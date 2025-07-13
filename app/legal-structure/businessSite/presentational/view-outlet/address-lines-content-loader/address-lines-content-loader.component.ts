import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-address-lines-content-loader',
  templateUrl: './address-lines-content-loader.component.html',
  styleUrls: ['./address-lines-content-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressLinesContentLoaderComponent implements OnInit {
  @Input()
  isLoading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
