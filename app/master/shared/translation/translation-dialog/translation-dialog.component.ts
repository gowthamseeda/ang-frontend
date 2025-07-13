import { KeyValue } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { MasterLanguage } from '../../../language/master-language/master-language.model';
import { MasterTranslation } from '../master-translation.model';

@Component({
  selector: 'gp-translation-dialog',
  templateUrl: './translation-dialog.component.html',
  styleUrls: ['./translation-dialog.component.scss']
})
export class TranslationDialogComponent implements OnInit {
  translationForm: UntypedFormGroup;
  language: MasterLanguage;
  serviceId: String;
  translation: KeyValue<string, MasterTranslation> | undefined;
  descriptionTranslation: KeyValue<string, MasterTranslation> | undefined;

  constructor(
    public dialogRef: MatDialogRef<TranslationDialogComponent>,
    private formBuilder: UntypedFormBuilder,
    private snackBarService: SnackBarService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.serviceId = data.serviceId;
    this.translation = data.translation;
    this.descriptionTranslation = data.descriptionTranslation;
  }

  ngOnInit() {
    this.initTranslationForm();
  }

  initTranslationForm() {
    const translation = this.translation?.value.serviceName ?? '';
    const descriptionTranslation = this.translation?.value.serviceDescription ?? '';

    this.translationForm = this.formBuilder.group({
      translation: [translation, [Validators.maxLength(100), Validators.required]],
      descriptionTranslation: [descriptionTranslation, [Validators.maxLength(256)]]
    });
  }

  changeLanguage(language: MasterLanguage) {
    this.language = language;

    if (this.translation && this.translation.key !== language.id) {
      this.translationForm.markAsDirty();
    }
  }

  onChange() {
    const translation: MasterTranslation = {
      serviceName: this.translationForm.get('translation')?.value,
      serviceDescription: this.translationForm.get('descriptionTranslation')?.value
    };
    this.dialogRef.close({ [this.language.id]: translation });
    this.router.navigateByUrl(`/master/service/${this.serviceId}`);
    this.translation
      ? this.snackBarService.showInfo('UPDATE_TRANSLATION_SUCCESS')
      : this.snackBarService.showInfo('CREATE_TRANSLATION_SUCCESS');
  }
}
