import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'gp-historization-toggle',
  templateUrl: './historization-toggle.component.html',
  styleUrls: ['./historization-toggle.component.scss']
})
export class HistorizationToggleComponent implements OnInit {
  @Output() displayChangesToggle = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  updateDisplayChangesToggle(displayChangesToggleEvent: MatSlideToggleChange): void {
    this.displayChangesToggle.emit(displayChangesToggleEvent.checked);
  }
}
