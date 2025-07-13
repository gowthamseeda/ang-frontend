import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-chips-content-loader',
  templateUrl: './chips-content-loader.component.html',
  styleUrls: ['./chips-content-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipsContentLoaderComponent implements OnInit {
  @Input()
  isLoading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
