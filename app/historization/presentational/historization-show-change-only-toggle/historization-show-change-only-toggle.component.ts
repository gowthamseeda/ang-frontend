import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'gp-historization-show-change-only-toggle',
  templateUrl: './historization-show-change-only-toggle.component.html',
  styleUrls: ['./historization-show-change-only-toggle.component.scss']
})
export class HistorizationShowChangeOnlyToggleComponent implements OnInit {
  @Output() showChangeOnlyToggle = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  updateShowChangeOnlyToggle(showChangeOnlyToggleToggleEvent: MatSlideToggleChange): void {
    this.showChangeOnlyToggle.emit(showChangeOnlyToggleToggleEvent.checked);
  }
}
