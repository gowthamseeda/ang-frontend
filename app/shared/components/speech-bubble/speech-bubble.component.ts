import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gp-speech-bubble',
  templateUrl: './speech-bubble.component.html',
  styleUrls: ['./speech-bubble.component.scss']
})
export class SpeechBubbleComponent {
  @Input() overlayOrigin: CdkOverlayOrigin;
  @Input() opened: boolean;
  @Output() openedChange = new EventEmitter<boolean>();

  openedChanged(opened: boolean): void {
    this.opened = opened;
    this.openedChange.emit(this.opened);
  }
}
