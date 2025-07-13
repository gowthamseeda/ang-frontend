import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { MasterLanguage } from '../../../language/master-language/master-language.model';
import { MasterLanguageService } from '../../../language/master-language/master-language.service';
import { MasterTranslation } from '../master-translation.model';

export interface TranslationTableRow {
  language: string;
  translation: any;
  descriptionTranslation: any;
}

MasterTranslation

@Component({
  selector: 'gp-translation-table',
  templateUrl: './translation-table.component.html',
  styleUrls: ['./translation-table.component.scss']
})
export class TranslationTableComponent implements OnInit, OnChanges {
  @Input()
  translations: KeyValue<string, any>;
  descriptionTranslation: KeyValue<string, any>;
  languages: MasterLanguage[];

  tableColumns = ['language', 'translation'];
  tableRows: TranslationTableRow[];

  dataSource = new MatTableDataSource<TranslationTableRow>([]);

  selectedTab = 0;

  @Input()
  IsActionRequired: boolean = false;
  tableColumnsWithActions = ['language', 'translation', 'actions'];

  @Output()
  removeTranslationByLanguages: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  edit: EventEmitter<KeyValue<string,MasterTranslation>> = new EventEmitter<KeyValue<string,MasterTranslation>>();

  translationsForm: UntypedFormGroup;

  translationsFormArray: UntypedFormArray;

  constructor(
    private languageService: MasterLanguageService,
     private formBuilder: UntypedFormBuilder,
     private dialog: MatDialog,
     private snackBarService: SnackBarService) {}

  ngOnInit(): void {
    this.initLanguages();
    this.initTranslationsFormGroup();
  }

  ngOnChanges(): void {
    if (this.translations) {
      const propertyNames = Object.keys(this.translations);
      this.tableRows = propertyNames.map(key => {
        return {
          language: key,
          translation: this.getTranslationName(this.translations[key]),
          descriptionTranslation: this.getTranslationDescription(this.translations[key])
        } as TranslationTableRow;
      });
      this.dataSource.data = this.tableRows.filter(row => row.translation !== undefined) ?? []
      this.initTranslationsFormGroup();
    }
  }

  getTranslationName(objectValue: KeyValue<string, any>): string {
    if(this.IsActionRequired)
      return typeof objectValue === 'object' ? objectValue['serviceName'] : objectValue;
    else
      return typeof objectValue === 'object' ? objectValue['name'] : objectValue;
  }

  getTranslationDescription(objectValue: KeyValue<string, any>): string {
    if(this.IsActionRequired)
      return typeof objectValue === 'object' ? objectValue['serviceDescription'] : objectValue;
    else
      return typeof objectValue === 'object' ? objectValue['name'] : objectValue;
  }

  languageBy(languageId: string): MasterLanguage | undefined {
    if (this.languages) {
      return this.languages.find(language => language.id === languageId);
    }
    return;
  }

  private initLanguages(): void {
    this.languageService.getAll().subscribe((languages: MasterLanguage[]) => {
      this.languages = languages;
    });
  }

  getColumn(): string[] {
    if(this.IsActionRequired) return this.tableColumnsWithActions;
    else return this.tableColumns;
  }

  removeTranslation(translationLanguage: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '650px',
      data: {
        title: 'DELETE_ENTRY',
        content: 'DELETE_ENTRY_QUESTION',
        confirmButton: 'YES'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if(confirmed){
        this.removeTranslationByLanguages.emit(translationLanguage);
        this.snackBarService.showInfo("DELETE_TRANSLATION_SUCCESS");
      }
    });
  }

  editTranslation(translationData: TranslationTableRow): void{
    const {language , translation, descriptionTranslation} = translationData
    const value : MasterTranslation = {
      serviceName: translation,
      serviceDescription: descriptionTranslation
    }
     this.edit.emit({key: language, value: value})
  }

  handleTabChange(event: any): void {
    this.selectedTab = event;
  }

  private initTranslationsFormGroup(): void {
    this.translationsFormArray = this.formBuilder.array([]);
    this.translationsForm = this.formBuilder.group({
      translation: this.translationsFormArray,
      nameTranslation: new UntypedFormControl()
    });
  };

}
