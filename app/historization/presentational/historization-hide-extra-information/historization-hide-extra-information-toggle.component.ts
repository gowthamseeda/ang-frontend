import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'gp-historization-hide-extra-information-toggle',
  templateUrl: './historization-hide-extra-information-toggle.component.html',
  styleUrls: ['./historization-hide-extra-information-toggle.component.scss']
})
export class HistorizationHideExtraInformationToggleComponent implements OnInit {
  @Output() hideExtraInformationToggle = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}

  updateHideExtraInformationToggle(hideExtraInformationToggleEvent: MatSlideToggleChange): void {
    this.hideExtraInformationToggle.emit(hideExtraInformationToggleEvent.checked);
  }
}
