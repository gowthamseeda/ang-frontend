import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'gp-tile-card',
  templateUrl: './tile-card.component.html',
  styleUrls: ['./tile-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileCardComponent implements OnInit {
  @Input()
  assetForBackgroundImage: string;
  @Input()
  isBanner: boolean;

  @Output()
  cardClick: EventEmitter<string> = new EventEmitter<string>();

  pathBackgroundImage: string;

  constructor() {}

  ngOnInit(): void {
    this.pathBackgroundImage = this.isBanner
      ? `url(assets/tiles/${this.assetForBackgroundImage})`
      : ``;
  }

  emitCardClickedEvent(): void {
    this.cardClick.emit();
  }
}
