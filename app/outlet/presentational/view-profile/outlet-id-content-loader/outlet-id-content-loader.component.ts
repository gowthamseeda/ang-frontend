import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-outlet-id-content-loader',
  templateUrl: './outlet-id-content-loader.component.html',
  styleUrls: ['./outlet-id-content-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletIdContentLoaderComponent implements OnInit {
  @Input()
  isLoading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
