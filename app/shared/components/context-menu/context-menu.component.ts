import { CdkOverlayOrigin, ConnectionPositionPair } from '@angular/cdk/overlay';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'gp-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {
  @Input()
  overlayOrigin: CdkOverlayOrigin;
  @Input()
  overlayPositions?: {
    connectionPositionPair: ConnectionPositionPair;
    offsetX: number;
    offsetY: number;
  };
  @Input()
  backdropStyle = 'cdk-overlay-transparent-backdrop';
  @Input()
  opened: boolean;
  @Output()
  openedChange = new EventEmitter<boolean>();

  positions: ConnectionPositionPair[];
  offsetX = 0;
  offsetY = 0;

  constructor() {}

  ngOnInit(): void {
    this.InitOverlayPosition();
  }

  close(): void {
    this.opened = false;
    this.openedChange.emit(this.opened);
  }

  private InitOverlayPosition(): void {
    if (!this.overlayPositions) {
      this.setDefaultPosition();
      return;
    }

    this.offsetX = this.overlayPositions.offsetX;
    this.offsetY = this.overlayPositions.offsetY;
    this.positions = [this.overlayPositions.connectionPositionPair];
  }

  private setDefaultPosition(): void {
    const position = new ConnectionPositionPair(
      { originX: 'start', originY: 'bottom' },
      { overlayX: 'start', overlayY: 'top' },
      0,
      0
    );

    this.positions = [position];
  }
}
