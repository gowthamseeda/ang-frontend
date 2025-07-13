import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'gp-historization-hide-additional-translations-toggle',
  templateUrl: './historization-hide-additional-translations-toggle.component.html',
  styleUrls: ['./historization-hide-additional-translations-toggle.component.scss']
})
export class HistorizationHideAdditionalTranslationsToggleComponent implements OnInit {
  @Output() hideAdditionalTranslationsToggle = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}

  updateHideAdditionalTranslationsToggle(hideAdditionalTranslationsToggleEvent: MatSlideToggleChange): void {
    this.hideAdditionalTranslationsToggle.emit(hideAdditionalTranslationsToggleEvent.checked);
  }
}
