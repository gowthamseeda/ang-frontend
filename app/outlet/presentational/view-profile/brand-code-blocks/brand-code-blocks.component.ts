import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gp-brand-code-blocks',
  templateUrl: './brand-code-blocks.component.html',
  styleUrls: ['./brand-code-blocks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandCodeBlocksComponent implements OnInit {
  @Input()
  brandCodes: string;

  constructor() {}

  ngOnInit(): void {}
}
