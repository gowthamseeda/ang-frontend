import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'gp-historization-hide-editor-toggle',
  templateUrl: './historization-hide-editor-toggle.component.html',
  styleUrls: ['./historization-hide-editor-toggle.component.scss']
})
export class HistorizationHideEditorToggleComponent implements OnInit {
  @Output() hideEditorsToggle = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}

  updateHideEditorsToggle(hideEditorsToggleEvent: MatSlideToggleChange): void {
    this.hideEditorsToggle.emit(hideEditorsToggleEvent.checked);
  }
}
