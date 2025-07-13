import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MasterTranslation } from 'app/master/shared/translation/master-translation.model';
import { ConfirmDialogComponent } from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from 'app/shared/services/snack-bar/snack-bar.service';
import { MasterLanguage } from '../../../language/master-language/master-language.model';
import { MasterLanguageService } from '../../../language/master-language/master-language.service';
import { MasterTranslationKey } from '../master-translation-key.model';

export interface TranslationTableRow {
  language: string;
  translation: any;
}

MasterTranslation;

@Component({
  selector: 'gp-translation-table-key',
  templateUrl: './translation-table-key.component.html',
  styleUrls: ['./translation-table-key.component.scss']
})
export class TranslationTableKeyComponent implements OnInit, OnChanges {
  @Input()
  translations: KeyValue<string, any>;
  languages: MasterLanguage[];

  tableColumns = ['language', 'translation'];
  tableRows: TranslationTableRow[];

  dataSource = new MatTableDataSource<TranslationTableRow>([]);

  @Input()
  IsActionRequired: boolean = false;
  tableColumnsWithActions = ['language', 'translation', 'actions'];

  @Output()
  removeTranslationByLanguages: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  edit: EventEmitter<KeyValue<string, MasterTranslationKey>> = new EventEmitter<
    KeyValue<string, MasterTranslationKey>
  >();

  translationsForm: UntypedFormGroup;

  translationsFormArray: UntypedFormArray;

  constructor(
    private languageService: MasterLanguageService,
    private formBuilder: UntypedFormBuilder,
    private dialog: MatDialog,
    private snackBarService: SnackBarService
  ) {}

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
          translation: this.getTranslationName(this.translations[key])
        } as TranslationTableRow;
      });
      this.dataSource.data = this.tableRows.filter(row => row.translation !== undefined) ?? [];
      this.initTranslationsFormGroup();
    }
  }

  getTranslationName(objectValue: KeyValue<string, any>): string {
    if (this.IsActionRequired)
      return typeof objectValue === 'object' ? objectValue['description'] : objectValue;
    else return typeof objectValue === 'object' ? objectValue['name'] : objectValue;
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
    if (this.IsActionRequired) return this.tableColumnsWithActions;
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
      if (confirmed) {
        this.removeTranslationByLanguages.emit(translationLanguage);
        this.snackBarService.showInfo('DELETE_TRANSLATION_SUCCESS');
      }
    });
  }

  editTranslation(translationData: TranslationTableRow): void {
    const { language, translation } = translationData;
    const value: MasterTranslationKey = {
      description: translation
    };
    this.edit.emit({ key: language, value: value });
  }

  private initTranslationsFormGroup(): void {
    this.translationsFormArray = this.formBuilder.array([]);
    this.translationsForm = this.formBuilder.group({
      translation: this.translationsFormArray,
      nameTranslation: new UntypedFormControl()
    });
  }
}
