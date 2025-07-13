import { KeyValue } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { MasterLanguage } from '../../../language/master-language/master-language.model';
import { MasterTranslationKey } from '../master-translation-key.model';

@Component({
  selector: 'gp-translation-dialog-key',
  templateUrl: './translation-dialog-key.component.html',
  styleUrls: ['./translation-dialog-key.component.scss']
})
export class TranslationDialogKeyComponent implements OnInit {
  translationForm: UntypedFormGroup;
  language: MasterLanguage;
  keyId: String;
  translation: KeyValue<string, MasterTranslationKey> | undefined;

  constructor(
    public dialogRef: MatDialogRef<TranslationDialogKeyComponent>,
    private formBuilder: UntypedFormBuilder,
    private snackBarService: SnackBarService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.keyId = data.keyId;
    this.translation = data.translation;
  }

  ngOnInit() {
    this.initTranslationForm();
  }

  initTranslationForm() {
    const translation = this.translation?.value.description ?? '';

    this.translationForm = this.formBuilder.group({
      translation: [translation, [Validators.maxLength(256), Validators.required]]
    });
  }

  changeLanguage(language: MasterLanguage) {
    this.language = language;

    if (this.translation && this.translation.key !== language.id) {
      this.translationForm.markAsDirty();
    }
  }

  onChange() {
    const translation: MasterTranslationKey = {
      description: this.translationForm.get('translation')?.value
    };
    this.dialogRef.close({ [this.language.id]: translation });
    this.router.navigateByUrl(`/master/keyType/${this.keyId}`);
    this.translation
      ? this.snackBarService.showInfo('UPDATE_TRANSLATION_SUCCESS')
      : this.snackBarService.showInfo('CREATE_TRANSLATION_SUCCESS');
  }
}
