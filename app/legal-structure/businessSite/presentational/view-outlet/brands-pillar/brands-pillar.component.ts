import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-brands-pillar',
  templateUrl: './brands-pillar.component.html',
  styleUrls: ['./brands-pillar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandsPillarComponent implements OnInit {
  @Input()
  brands: string[];

  constructor() {}

  ngOnInit(): void {}
}
