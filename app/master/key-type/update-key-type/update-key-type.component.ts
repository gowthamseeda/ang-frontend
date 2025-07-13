import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {KeyValue} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {SnackBarService} from '../../../shared/services/snack-bar/snack-bar.service';
import {MasterCountry} from '../../country/master-country/master-country.model';
import {MasterKeyType} from '../../services/master-key/master-key.model';
import {MasterKeyService} from '../../services/master-key/master-key.service';
import {MasterTranslationKey} from '../translation/master-translation-key.model';
import {TranslationDialogKeyComponent} from '../translation/translation-dialog-key/translation-dialog-key.component';

@Component({
  selector: 'gp-update-key-type',
  templateUrl: './update-key-type.component.html',
  styleUrls: ['./update-key-type.component.scss']
})
export class UpdateKeyTypeComponent implements OnInit {
  keyTypeForm: UntypedFormGroup;
  id: string;
  keyTypeName: string;
  saveDisabled = false;
  keyType: MasterKeyType;
  countryRestrictionIds: string[] = [];
  currentTranslations: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private keyService: MasterKeyService,
    private router: Router,
    private snackBarService: SnackBarService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.initKeyTypeForm();
    this.getServiceIdByRouteParams().subscribe(() => {
      this.initKeyType();
    });
  }

  submit(keyType: MasterKeyType): void {
    keyType.id = this.id;
    if (this.keyTypeForm.controls.description.value.trim() === '') {
      delete keyType.description;
    }

    this.disableSaveButton();
    this.keyService.update(keyType).subscribe({
        next: () => {
          this.router.navigateByUrl('/master');
          this.snackBarService.showInfo('UPDATE_KEY_TYPE_SUCCESS');
        },
        error: error => {
          this.snackBarService.showError(error);
        }
      }).add(() => this.enableSaveButton());
  }

  initKeyTypeForm(): void {
    this.keyTypeForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      translations: [{ value: {} }],
      description: ['', [Validators.maxLength(256)]],
      maxValueLength: [{ value: '256', disabled: true }, [Validators.required, Validators.min(0)]],
      countryRestrictions: [[]],
      brandRestrictions: [[]],
      productGroupRestrictions: [[]]
    });
  }

  private disableSaveButton(): void {
    this.saveDisabled = true;
  }

  private enableSaveButton(): void {
    this.saveDisabled = false;
  }

  private getServiceIdByRouteParams(): Observable<string> {
    return this.route.paramMap.pipe(
      map((params: ParamMap) => {
        const id = params.get('id');
        return (this.id = id ? id : '');
      })
    );
  }

  private initKeyType(): void {
    this.keyService.get(this.id).subscribe((keyType: MasterKeyType) => {
      this.keyTypeName = keyType.name;
      this.currentTranslations = keyType.translations;
      this.keyType = keyType;
      this.keyTypeForm.patchValue({
        id: keyType.id,
        name: keyType.name,
        description: keyType.description,
        translations: keyType.translations,
        maxValueLength: keyType.maxValueLength,
        countryRestrictions: keyType.countryRestrictions,
        brandRestrictions: keyType.brandRestrictions,
        productGroupRestrictions: keyType.productGroupRestrictions
      });
      if (keyType.countryRestrictions) {
        this.countryRestrictionIds = keyType.countryRestrictions;
      } else {
        this.countryRestrictionIds = [];
      }
      this.keyTypeForm.markAsPristine();
    });
  }

  restrictedCountries(countries: MasterCountry[]): void {
    this.countryRestrictionIds = countries.map(country => {
      return country.id;
    });
    this.keyTypeForm.patchValue({ countryRestrictions: this.countryRestrictionIds });
  }

  removeSingleTranslation(translationLanguages: string): void {
    if (this.currentTranslations) {
      let translation = this.currentTranslations;
      let filteredTranslations = Object.keys(translation).reduce((obj, key) => {
        if (key !== translationLanguages) {
          obj[key] = translation[key];
        }
        return obj;
      }, {});
      this.keyTypeForm.patchValue({ translations: filteredTranslations });
      this.currentTranslations = filteredTranslations;
    }
    this.keyTypeForm.markAsDirty();
  }

  addNewTranslation(event: Event): void {
    event.preventDefault();
    const dialogRef = this.dialog.open(TranslationDialogKeyComponent, {
      width: '650px',
      data: {
        keyId: this.keyTypeForm.get('id')?.value
      }
    });

    dialogRef.afterClosed().subscribe((translation: KeyValue<string, any>) => {
      if (translation) {
        const translations = this.currentTranslations;
        const newTranslations = { ...translations, ...translation };
        this.currentTranslations = newTranslations;
        this.keyTypeForm.get('translations')?.setValue(newTranslations);
        this.keyTypeForm.markAsDirty();
      }
    });
  }

  editTranslation(currentTranslation: KeyValue<string, MasterTranslationKey>) {
    const dialogRef = this.dialog.open(TranslationDialogKeyComponent, {
      width: '650px',
      data: {
        keyId: this.keyTypeForm.get('id')?.value,
        translation: currentTranslation
      }
    });

    dialogRef.afterClosed().subscribe((translation: KeyValue<string, any>) => {
      if (translation) {
        if (!translation[currentTranslation.key]) {
          this.removeSingleTranslation(currentTranslation.key);
        }
        const translations = this.currentTranslations;
        const newTranslations = { ...translations, ...translation };
        this.currentTranslations = newTranslations;

        this.keyTypeForm.get('translations')?.setValue(newTranslations);
        this.keyTypeForm.markAsDirty();
      }
    });
  }
}
