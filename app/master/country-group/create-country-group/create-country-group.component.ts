import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterCountry } from '../../country/master-country/master-country.model';
import { MasterCountryService } from '../../country/master-country/master-country.service';
import { MasterCountryGroup } from '../../services/master-country-group/master-country-group.model';
import { MasterCountryGroupService } from '../../services/master-country-group/master-country-group.service';

@Component({
  selector: 'gp-create-country-group',
  templateUrl: './create-country-group.component.html',
  styleUrls: ['./create-country-group.component.scss']
})
export class CreateCountryGroupComponent implements OnInit {
  countryGroupForm: UntypedFormGroup;
  countries: MasterCountry[];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private countryGroupService: MasterCountryGroupService,
    private countryService: MasterCountryService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initCountryGroupForm();
    this.initCountries();
  }

  submit(countryGroup: MasterCountryGroup): void {
    this.countryGroupService.create(countryGroup).subscribe(
      () => {
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('CREATE_COUNTRY_GROUP_SUCCESS');
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  private initCountries(): void {
    this.countryService.getAll().subscribe((countries: MasterCountry[]) => {
      this.countries = countries;
    });
  }

  private initCountryGroupForm(): void {
    this.countryGroupForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      countryIds: [[]]
    });
  }
}
