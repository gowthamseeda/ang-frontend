import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-outlet-id-and-status-content-loader',
  templateUrl: './outlet-id-and-status-content-loader.component.html',
  styleUrls: ['./outlet-id-and-status-content-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletStatusContentLoaderComponent implements OnInit {
  @Input()
  isLoading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
