import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterLanguage } from '../master-language/master-language.model';
import { MasterLanguageService } from '../master-language/master-language.service';

import { LanguageTagValidator } from './language-tag-validator';

@Component({
  selector: 'gp-create-language',
  templateUrl: './create-language.component.html',
  styleUrls: ['./create-language.component.scss']
})
export class CreateLanguageComponent implements OnInit {
  languageForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private languageService: MasterLanguageService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initLanguageForm();
  }

  submit(language: MasterLanguage): void {
    this.languageService.create(language).subscribe(
      () => {
        this.languageService.clearCacheAndFetchAll();
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('CREATE_LANGUAGE_SUCCESS');
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  private initLanguageForm(): void {
    this.languageForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.maxLength(100), this.validateId]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      representation: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  private validateId(control: AbstractControl): any {
    const languageTagValidator: LanguageTagValidator = new LanguageTagValidator();
    if (control.value && !languageTagValidator.validate(control.value)) {
      return { validId: true };
    }
    return null;
  }
}
