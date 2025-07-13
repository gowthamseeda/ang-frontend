import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-business-names-content-loader',
  templateUrl: './business-names-content-loader.component.html',
  styleUrls: ['./business-names-content-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessNamesContentLoaderComponent implements OnInit {
  @Input()
  isLoading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
