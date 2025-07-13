import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'gp-header-tile-content',
  templateUrl: './header-tile-content.component.html',
  styleUrls: ['./header-tile-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderTileContentComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
