import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'gp-gps-tile-content',
  templateUrl: './gps-tile-content.component.html',
  styleUrls: ['./gps-tile-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpsTileContentComponent implements OnInit {
  @Input()
  latitude: string;
  @Input()
  longitude: string;
  mapReady: Observable<boolean> = of(false);

  constructor() {}

  ngOnInit(): void {}

  mapReadyEvent(ready: boolean): void {
    this.mapReady = of(ready);
  }
}
