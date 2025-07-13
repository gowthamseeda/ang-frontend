import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DURATION_UNIT } from '../../help.constants';
import { Video } from '../../help.model';

@Component({
  selector: 'gp-help-video',
  templateUrl: './help-video.component.html',
  styleUrls: ['./help-video.component.scss']
})
export class HelpVideoComponent implements OnInit {
  @Input()
  video: Video;

  @Input()
  visibleDuration = false;

  @Input()
  visibleAdditionalActions = false;

  @Input()
  DURATION_UNIT = DURATION_UNIT;

  @Output()
  playEvent: EventEmitter<Video> = new EventEmitter<Video>();

  constructor() {}

  ngOnInit(): void {}

  playVideo(video: Video): void {
    this.playEvent.emit(video);
  }
}
