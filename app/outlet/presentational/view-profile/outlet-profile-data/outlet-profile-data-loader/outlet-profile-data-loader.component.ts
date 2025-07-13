import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-outlet-profile-data-loader',
  templateUrl: './outlet-profile-data-loader.component.html',
  styleUrls: ['./outlet-profile-data-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletProfileDataLoaderComponent implements OnInit {
  @Input()
  isLoading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
