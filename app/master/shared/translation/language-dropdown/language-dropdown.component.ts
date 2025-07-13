import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {MatSelectChange} from '@angular/material/select';

import {MasterLanguage} from "../../../language/master-language/master-language.model";
import {MasterLanguageService} from "../../../language/master-language/master-language.service";
import {UntypedFormControl} from '@angular/forms';
import {map} from 'rxjs/operators';

const languageEN: string = 'en';

@Component({
  selector: 'gp-language-dropdown',
  templateUrl: './language-dropdown.component.html',
  styleUrls: ['./language-dropdown.component.scss']
})
export class LanguageDropdownComponent implements OnInit {
  @Input() placeHolder: string;
  @Input() selectedLanguage: string | undefined;

  @Output() private selectedLanguageChanged = new EventEmitter<any>();
  languages: MasterLanguage[];
  languageControl: UntypedFormControl = new UntypedFormControl('');


  constructor(
    private languageService: MasterLanguageService) {
  }

  ngOnInit() {
    const languages = this.languageService.getAll();

    languages
      .pipe(map(sortedLanguages => sortedLanguages.sort(this.sortLanguageByName)))
      .subscribe(result => {
        this.languages = result;
        this.selectLanguage();
      });
  }

  private selectLanguage() {
    const languageObj = this.languageService.getLanguage()

    if (languageObj) {
      this.getCurrentLanguage(languageObj.id);
    } else {
      this.selectDefaultLanguage();
    }
  }

  private getCurrentLanguage(id: string) {
    const language = this.languages.find( language => language.id === id);
    if(language){
      this.updateLanguageDropdown(language);
    }
  }

  private selectDefaultLanguage() {
    let isLanguageEN;
    const language = this.selectedLanguage ?? languageEN

    this.languages.forEach((item, index) => {
      if (item.id === language) {
        isLanguageEN = true;
        this.updateLanguageDropdown(this.languages[index]);
      }
    });
    if (!isLanguageEN) {
      this.updateLanguageDropdown(this.languages[0]);
    }
  }

  private updateLanguageDropdown(language: MasterLanguage) {
    this.languageControl.patchValue(language);
    this.selectedLanguageChanged.emit(language);
  }

  private sortLanguageByName(a: MasterLanguage, b: MasterLanguage): number {
    return a.name.localeCompare(b.name);
  }

  onChange(changeEvent: MatSelectChange) {
    this.selectedLanguageChanged.emit(changeEvent.value);
  }
}
