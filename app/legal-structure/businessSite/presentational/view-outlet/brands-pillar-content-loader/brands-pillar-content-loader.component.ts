import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-brands-pillar-content-loader',
  templateUrl: './brands-pillar-content-loader.component.html',
  styleUrls: ['./brands-pillar-content-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandsPillarContentLoaderComponent implements OnInit {
  @Input()
  isLoading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
