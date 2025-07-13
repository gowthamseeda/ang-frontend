import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterCountry } from '../../country/master-country/master-country.model';
import { MasterKeyType } from '../../services/master-key/master-key.model';
import { MasterKeyService } from '../../services/master-key/master-key.service';

@Component({
  selector: 'gp-create-key-type',
  templateUrl: './create-key-type.component.html',
  styleUrls: ['./create-key-type.component.scss']
})
export class CreateKeyTypeComponent implements OnInit {
  keyTypeForm: UntypedFormGroup;
  countryRestrictionIds: string[];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private keyService: MasterKeyService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initKeyTypeForm();
    this.countryRestrictionIds = [];
  }

  submit(keyType: MasterKeyType): void {
    this.keyService.create(keyType).subscribe(
      () => {
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('CREATE_KEY_TYPE_SUCCESS');
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  private initKeyTypeForm(): void {
    this.keyTypeForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.maxLength(256)]],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      maxValueLength: [{ value: '256', disabled: true }, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.maxLength(256)]],
      countryRestrictions: [[]],
      brandRestrictions: [[]],
      productGroupRestrictions: [[]]
    });
  }

  restrictedCountries(countries: MasterCountry[]): void {
    this.countryRestrictionIds = countries.map(country => {
      return country.id;
    });
    this.keyTypeForm.patchValue({ countryRestrictions: this.countryRestrictionIds });
  }
}
