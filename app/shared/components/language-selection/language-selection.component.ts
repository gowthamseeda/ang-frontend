import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Language } from '../../../geography/language/language.model';

@Component({
  selector: 'gp-language-selection',
  templateUrl: './language-selection.component.html',
  styleUrls: ['./language-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSelectionComponent implements OnChanges {
  @Input()
  languages: Language[] = [];
  @Input()
  label: string;
  @Input()
  required: boolean;
  @Input()
  readonly: boolean;
  @Input()
  isLoading: boolean;

  @Output()
  languageSelectionChanged = new EventEmitter<string>();

  selectedLanguage: string | undefined;
  sortedLanguages: Language[] = [];

  constructor() {
  }

  ngOnChanges(): void {
    this.sortedLanguages = this.languages?.sort((a, b) => a.name.localeCompare(b.name));
  }

  @Input()
  set selected(languageId: string | undefined) {
    this.selectedLanguage = languageId;
  }

  emitSelectionChange(selectedValue: string): void {
    this.languageSelectionChanged.emit(selectedValue);
  }
}
